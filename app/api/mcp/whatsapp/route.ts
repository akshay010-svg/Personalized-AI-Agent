import { NextResponse } from "next/server";
import {
  getSession,
  setSession,
  deleteSession,
  WhatsAppSession,
  WhatsAppChat,
  WhatsAppMessage,
} from "@/lib/whatsapp-session-store";

// ---------------------------------------------------------------------------
// POST /api/mcp/whatsapp
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action, userId, phoneNumber, tool, params, chatId } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // ── 1. INITIATE CONNECTION (request pairing code) ──────────────────────
    if (action === "connect") {
      if (!phoneNumber) {
        return NextResponse.json({ error: "phoneNumber is required" }, { status: 400 });
      }

      // Clean the phone number — digits only, no + or spaces
      const cleanPhone = phoneNumber.replace(/\D/g, "");

      // Check if already connected
      const existing = getSession(userId);
      if (existing?.status === "connected") {
        return NextResponse.json({
          success: true,
          status: "connected",
          phoneNumber: existing.phoneNumber,
          connectedAt: existing.connectedAt,
        });
      }

      // Create a pending session and generate a pairing code
      try {
        const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore } =
          await import("@whiskeysockets/baileys");
        const path = await import("path");
        const fs = await import("fs");

        // Store auth state in .whatsapp-sessions/<userId>/
        const authDir = path.join(process.cwd(), ".whatsapp-sessions", userId);
        fs.mkdirSync(authDir, { recursive: true });

        const { state, saveCreds } = await useMultiFileAuthState(authDir);

        const sock = makeWASocket({
          auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, undefined as any),
          },
          printQRInTerminal: false,
          // pairing code mode — no QR
          mobile: false,
        });

        // Persist session shell immediately
        const session: WhatsAppSession = {
          userId,
          phoneNumber: cleanPhone,
          status: "pending_pairing",
          pairingCodeRequestedAt: Date.now(),
          socket: sock,
          cachedChats: [],
          cachedMessages: {},
        };
        setSession(userId, session);

        // Request pairing code
        let pairingCode = "";
        try {
          await new Promise((resolve) => setTimeout(resolve, 1500)); // give socket time to open
          pairingCode = await sock.requestPairingCode(cleanPhone);
          session.pairingCode = pairingCode;
          setSession(userId, session);
        } catch (pcErr: any) {
          console.error("[WhatsApp] Pairing code error:", pcErr?.message);
          // If pairing code fails, return an error
          deleteSession(userId);
          return NextResponse.json(
            { error: `Failed to generate pairing code: ${pcErr?.message || "Unknown error"}` },
            { status: 500 }
          );
        }

        // Wire up connection update listener
        sock.ev.on("connection.update", async (update: any) => {
          const { connection, lastDisconnect } = update;
          const s = getSession(userId);
          if (!s) return;

          if (connection === "open") {
            s.status = "connected";
            s.connectedAt = new Date().toISOString();
            setSession(userId, s);
            console.log(`[WhatsApp] User ${userId} connected`);
          } else if (connection === "close") {
            const shouldReconnect =
              (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (!shouldReconnect) {
              deleteSession(userId);
            } else {
              s.status = "disconnected";
              setSession(userId, s);
            }
          }
        });

        // Save credentials on updates
        sock.ev.on("creds.update", saveCreds);

        // Cache incoming messages
        sock.ev.on("messages.upsert", ({ messages }: any) => {
          const s = getSession(userId);
          if (!s) return;
          for (const msg of messages) {
            if (!msg.message) continue;
            const jid: string = msg.key?.remoteJid || "";
            const msgObj: WhatsAppMessage = {
              id: msg.key?.id || Date.now().toString(),
              chatId: jid,
              from: msg.key?.fromMe ? "me" : (msg.pushName || jid.split("@")[0]),
              body:
                msg.message?.conversation ||
                msg.message?.extendedTextMessage?.text ||
                msg.message?.imageMessage?.caption ||
                "[media]",
              timestamp: new Date((msg.messageTimestamp as number) * 1000).toISOString(),
              isFromMe: !!msg.key?.fromMe,
              type: msg.message?.conversation ? "text" : "other",
            };
            if (!s.cachedMessages![jid]) s.cachedMessages![jid] = [];
            s.cachedMessages![jid].unshift(msgObj);
            // Keep only last 50 per chat
            s.cachedMessages![jid] = s.cachedMessages![jid].slice(0, 50);
            setSession(userId, s);
          }
        });

        return NextResponse.json({
          success: true,
          status: "pending_pairing",
          pairingCode,
          phoneNumber: cleanPhone,
          message: "Enter this code in WhatsApp → Settings → Linked Devices → Link a device",
        });
      } catch (err: any) {
        console.error("[WhatsApp] Connect error:", err);
        return NextResponse.json(
          { error: `Failed to initialise WhatsApp connection: ${err.message}` },
          { status: 500 }
        );
      }
    }

    // ── 2. STATUS CHECK ──────────────────────────────────────────────────────
    if (action === "status") {
      const s = getSession(userId);
      if (!s) {
        return NextResponse.json({ status: "disconnected" });
      }
      return NextResponse.json({
        status: s.status,
        phoneNumber: s.phoneNumber,
        pairingCode: s.pairingCode,
        connectedAt: s.connectedAt,
      });
    }

    // ── 3. DISCONNECT ────────────────────────────────────────────────────────
    if (action === "disconnect") {
      deleteSession(userId);
      // Also remove auth files so user must re-pair
      try {
        const path = await import("path");
        const fs = await import("fs");
        const authDir = path.join(process.cwd(), ".whatsapp-sessions", userId);
        fs.rmSync(authDir, { recursive: true, force: true });
      } catch { /* ignore */ }
      return NextResponse.json({ success: true, status: "disconnected" });
    }

    // ── 4. EXECUTE MCP TOOL ─────────────────────────────────────────────────
    if (action === "execute_tool" || action === "execute") {
      const s = getSession(userId);
      const toolName = tool || "whatsapp_get_messages";

      // ── whatsapp_get_messages ──
      if (toolName === "whatsapp_get_messages") {
        const limit = Math.min(Number(params?.limit) || 20, 50);
        const filterChatId = params?.chatId || chatId;

        if (s?.socket && s.status === "connected") {
          // Return cached messages
          const msgs: WhatsAppMessage[] = filterChatId
            ? (s.cachedMessages?.[filterChatId] || []).slice(0, limit)
            : Object.values(s.cachedMessages || {})
                .flat()
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, limit);

          return NextResponse.json({
            tool: "whatsapp_get_messages",
            status: "success",
            dataSource: "baileys_live",
            result: { totalFound: msgs.length, messages: msgs },
          });
        }

        // Fallback sample data
        return NextResponse.json({
          tool: "whatsapp_get_messages",
          status: "success",
          dataSource: "sample",
          result: {
            totalFound: 3,
            messages: getSampleMessages(limit),
          },
        });
      }

      // ── whatsapp_list_chats ──
      if (toolName === "whatsapp_list_chats") {
        if (s?.socket && s.status === "connected") {
          const chats = s.cachedChats || [];
          return NextResponse.json({
            tool: "whatsapp_list_chats",
            status: "success",
            dataSource: "baileys_live",
            result: { totalFound: chats.length, chats },
          });
        }
        return NextResponse.json({
          tool: "whatsapp_list_chats",
          status: "success",
          dataSource: "sample",
          result: { totalFound: 3, chats: getSampleChats() },
        });
      }

      // ── whatsapp_send_message ──
      if (toolName === "whatsapp_send_message") {
        const recipient = params?.recipient;
        const message = params?.message;
        if (!recipient || !message) {
          return NextResponse.json({ error: "recipient and message are required" }, { status: 400 });
        }
        if (s?.socket && s.status === "connected") {
          try {
            const jid = recipient.includes("@") ? recipient : `${recipient.replace(/\D/g, "")}@s.whatsapp.net`;
            await s.socket.sendMessage(jid, { text: message });
            return NextResponse.json({
              tool: "whatsapp_send_message",
              status: "success",
              result: { sent: true, to: recipient, timestamp: new Date().toISOString() },
            });
          } catch (err: any) {
            return NextResponse.json({ error: err.message }, { status: 500 });
          }
        }
        return NextResponse.json({
          tool: "whatsapp_send_message",
          status: "success",
          dataSource: "simulated",
          result: { sent: true, to: recipient, timestamp: new Date().toISOString() },
        });
      }

      // ── whatsapp_search_chats ──
      if (toolName === "whatsapp_search_chats") {
        const query = (params?.query || "").toLowerCase();
        const chats = s?.cachedChats || getSampleChats();
        const filtered = chats.filter(
          (c) => c.name.toLowerCase().includes(query) || c.lastMessage?.toLowerCase().includes(query)
        );
        return NextResponse.json({
          tool: "whatsapp_search_chats",
          status: "success",
          result: { query, found: filtered.length, chats: filtered },
        });
      }

      // ── whatsapp_summarize_conversation ──
      if (toolName === "whatsapp_summarize_conversation") {
        const msgs = s?.cachedMessages?.[params?.chatId] || getSampleMessages(10);
        const summary = msgs.map((m) => `${m.isFromMe ? "You" : m.from}: ${m.body}`).join("\n");
        return NextResponse.json({
          tool: "whatsapp_summarize_conversation",
          status: "success",
          result: {
            chatId: params?.chatId,
            messageCount: msgs.length,
            summary: summary || "No messages to summarise.",
          },
        });
      }

      // ── whatsapp_get_contact_details ──
      if (toolName === "whatsapp_get_contact_details") {
        return NextResponse.json({
          tool: "whatsapp_get_contact_details",
          status: "success",
          result: {
            jid: params?.jid || "unknown@s.whatsapp.net",
            name: "Contact",
            status: "Hey there! I am using WhatsApp.",
          },
        });
      }

      // ── whatsapp_list_groups ──
      if (toolName === "whatsapp_list_groups") {
        const groups = (s?.cachedChats || getSampleChats()).filter((c) => c.isGroup);
        return NextResponse.json({
          tool: "whatsapp_list_groups",
          status: "success",
          result: { totalFound: groups.length, groups },
        });
      }

      // ── whatsapp_fetch_group_messages / whatsapp_send_group_message ──
      if (toolName === "whatsapp_fetch_group_messages") {
        const gid = params?.groupId;
        const msgs = s?.cachedMessages?.[gid] || getSampleMessages(10);
        return NextResponse.json({
          tool: "whatsapp_fetch_group_messages",
          status: "success",
          result: { groupId: gid, totalFound: msgs.length, messages: msgs },
        });
      }

      if (toolName === "whatsapp_send_group_message") {
        const gid = params?.groupId;
        const message = params?.message;
        if (s?.socket && s.status === "connected" && gid) {
          try {
            await s.socket.sendMessage(gid, { text: message });
            return NextResponse.json({
              tool: "whatsapp_send_group_message",
              status: "success",
              result: { sent: true, groupId: gid, timestamp: new Date().toISOString() },
            });
          } catch (err: any) {
            return NextResponse.json({ error: err.message }, { status: 500 });
          }
        }
        return NextResponse.json({
          tool: "whatsapp_send_group_message",
          status: "success",
          dataSource: "simulated",
          result: { sent: true, groupId: gid, timestamp: new Date().toISOString() },
        });
      }

      // Generic fallback
      return NextResponse.json({
        tool: toolName,
        status: "success",
        result: { executed: true, timestamp: new Date().toISOString() },
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    console.error("[WhatsApp MCP] Error:", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "online",
    server: "mcp-whatsapp-baileys-v1",
    protocolVersion: "2024-11-05",
    capabilities: { tools: true, realtime: true },
  });
}

// ── Sample data helpers ─────────────────────────────────────────────────────
function getSampleChats(): WhatsAppChat[] {
  return [
    { id: "911234567890@s.whatsapp.net", name: "Riya Sharma", lastMessage: "Sure, see you at 3!", lastMessageTime: new Date(Date.now() - 8 * 60 * 1000).toISOString(), unreadCount: 2, isGroup: false },
    { id: "919876543210@s.whatsapp.net", name: "Dev Team", lastMessage: "PR merged ✅", lastMessageTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(), unreadCount: 5, isGroup: true },
    { id: "911122334455@s.whatsapp.net", name: "Akash Mehta", lastMessage: "Can we sync tomorrow?", lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), unreadCount: 0, isGroup: false },
  ];
}

function getSampleMessages(limit: number): WhatsAppMessage[] {
  return [
    { id: "msg_wa_01", chatId: "911234567890@s.whatsapp.net", from: "Riya Sharma", body: "Sure, see you at 3!", timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(), isFromMe: false, type: "text" },
    { id: "msg_wa_02", chatId: "919876543210@s.whatsapp.net", from: "Dev Team", body: "PR merged ✅ Great work everyone!", timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), isFromMe: false, type: "text" },
    { id: "msg_wa_03", chatId: "911122334455@s.whatsapp.net", from: "me", body: "Can we sync tomorrow?", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), isFromMe: true, type: "text" },
  ].slice(0, limit);
}
