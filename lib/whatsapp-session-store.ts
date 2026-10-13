// Server-side per-user WhatsApp session store (in-memory)
// Each entry holds the Baileys WASocket and connection metadata for one user

export interface WhatsAppSession {
  userId: string;
  phoneNumber: string;
  pairingCode?: string;
  pairingCodeRequestedAt?: number;
  status: "pending_pairing" | "connecting" | "connected" | "disconnected";
  connectedAt?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket?: any; // Baileys WASocket — typed as any to avoid heavy imports here
  cachedChats?: WhatsAppChat[];
  cachedMessages?: Record<string, WhatsAppMessage[]>;
}

export interface WhatsAppChat {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isGroup: boolean;
}

export interface WhatsAppMessage {
  id: string;
  chatId: string;
  from: string;
  body: string;
  timestamp: string;
  isFromMe: boolean;
  type: "text" | "image" | "audio" | "video" | "document" | "sticker" | "other";
}

// Keyed by userId
const sessions = new Map<string, WhatsAppSession>();

export function getSession(userId: string): WhatsAppSession | undefined {
  return sessions.get(userId);
}

export function setSession(userId: string, session: WhatsAppSession) {
  sessions.set(userId, session);
}

export function deleteSession(userId: string) {
  const s = sessions.get(userId);
  if (s?.socket) {
    try { s.socket.end(); } catch { /* ignore */ }
  }
  sessions.delete(userId);
}

export function getAllSessions() {
  return sessions;
}
