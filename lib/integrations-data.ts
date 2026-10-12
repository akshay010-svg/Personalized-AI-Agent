export interface MCPToolParam {
  name: string;
  type: string;
  description: string;
  optional?: boolean;
  default?: any;
}

export interface MCPTool {
  name: string;
  displayName: string;
  type: "read" | "write" | "admin";
  description: string;
  parameters: MCPToolParam[];
  sampleOutput?: any;
}

export interface PlatformIntegration {
  id: string;
  name: string;
  logo: string; // path inside /public
  description: string; // Two-line description
  category: string;
  badge?: string;
  isPopular?: boolean;
  mcpServer: string;
  mcpProtocol: string;
  defaultConnected?: boolean;
  defaultEmail?: string;
  tools: MCPTool[];
}

export const PLATFORMS_DATA: PlatformIntegration[] = [
  {
    id: "gmail",
    name: "Gmail",
    logo: "/gmail.svg",
    description: "Connect your Google inbox to auto-triage emails, flag urgent threads, and generate daily AI summaries.",
    category: "Google Workspace",
    badge: "MCP Enabled",
    isPopular: true,
    mcpServer: "mcp/gmail-bridge",
    mcpProtocol: "JSON-RPC 2.0 / SSE",
    tools: [
      {
        name: "gmail_fetch_emails",
        displayName: "Fetch Recent Emails",
        type: "read",
        description: "Fetch messages from the user's Gmail inbox matching optional queries (e.g. 'is:unread', 'from:finance').",
        parameters: [
          { name: "q", type: "string", description: "Search query filter (e.g., 'is:unread', 'label:INBOX')", optional: true, default: "is:unread" },
          { name: "maxResults", type: "number", description: "Maximum messages to return", optional: true, default: 5 },
          { name: "includeSpamTrash", type: "boolean", description: "Include messages from SPAM/TRASH", optional: true, default: false }
        ]
      },
      {
        name: "gmail_get_message",
        displayName: "Get Email Details",
        type: "read",
        description: "Retrieve full body text, headers, and metadata for a specific message by its messageId.",
        parameters: [
          { name: "messageId", type: "string", description: "Unique identifier of the message", optional: false }
        ]
      },
      {
        name: "gmail_search_threads",
        displayName: "Search Conversation Threads",
        type: "read",
        description: "Search email conversation threads across the inbox to provide contextual memory for briefings.",
        parameters: [
          { name: "query", type: "string", description: "Search term or conversation topic", optional: false },
          { name: "maxResults", type: "number", description: "Maximum threads to retrieve", optional: true, default: 5 }
        ]
      },
      {
        name: "gmail_send_message",
        displayName: "Send Email",
        type: "write",
        description: "Send a new email or agent-generated response to a specified recipient.",
        parameters: [
          { name: "to", type: "string", description: "Recipient email address", optional: false },
          { name: "subject", type: "string", description: "Subject line", optional: false },
          { name: "body", type: "string", description: "Message body in text or HTML", optional: false }
        ]
      },
      {
        name: "gmail_create_draft",
        displayName: "Create Draft Message",
        type: "write",
        description: "Create an email draft in the user's Gmail Drafts folder without automatically dispatching it.",
        parameters: [
          { name: "to", type: "string", description: "Recipient email address", optional: false },
          { name: "subject", type: "string", description: "Subject line", optional: false },
          { name: "body", type: "string", description: "Body content for the draft", optional: false }
        ]
      },
      {
        name: "gmail_list_labels",
        displayName: "List Inbox Labels",
        type: "read",
        description: "Get all labels in the user's Gmail account (INBOX, UNREAD, STARRED, IMPORTANT, Custom Categories).",
        parameters: []
      },
      {
        name: "gmail_modify_labels",
        displayName: "Modify Message Labels",
        type: "write",
        description: "Add or remove labels on messages (mark as read, star, archive from inbox).",
        parameters: [
          { name: "messageId", type: "string", description: "Target message ID", optional: false },
          { name: "addLabelIds", type: "array", description: "Label IDs to attach", optional: true },
          { name: "removeLabelIds", type: "array", description: "Label IDs to detach", optional: true }
        ]
      }
    ]
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    logo: "/whatsapp.svg",
    description: "Bridge chats and groups to synthesize discussions, mute banter, and transcribe incoming voice notes.",
    category: "Messaging & VoIP",
    badge: "Live Bridge",
    isPopular: true,
    mcpServer: "mcp/whatsapp-bridge",
    mcpProtocol: "WebSocket / Protocol Buffers",
    tools: [
      {
        name: "whatsapp_get_messages",
        displayName: "Fetch Recent Messages",
        type: "read",
        description: "Fetch latest incoming messages and thread chats from synced WhatsApp account.",
        parameters: [
          { name: "chatId", type: "string", description: "Phone number with country code or group JID", optional: true },
          { name: "limit", type: "number", description: "Maximum messages to retrieve", optional: true, default: 20 }
        ]
      },
      {
        name: "whatsapp_send_message",
        displayName: "Send Instant Message",
        type: "write",
        description: "Dispatch instant text or media messages to individual contacts or approved groups.",
        parameters: [
          { name: "recipient", type: "string", description: "Contact number or group JID", optional: false },
          { name: "message", type: "string", description: "Text content to dispatch", optional: false }
        ]
      },
      {
        name: "whatsapp_list_chats",
        displayName: "List Active Chats",
        type: "read",
        description: "List recent direct chats and group channels with unread counts and timestamps.",
        parameters: [
          { name: "unreadOnly", type: "boolean", description: "Only return chats with unread messages", optional: true, default: false }
        ]
      },
      {
        name: "whatsapp_transcribe_audio",
        displayName: "Transcribe Voice Note",
        type: "read",
        description: "Convert incoming audio voice notes into clean transcriptions and bullet summaries.",
        parameters: [
          { name: "messageId", type: "string", description: "Identifier of the audio message", optional: false }
        ]
      }
    ]
  },
  {
    id: "slack",
    name: "Slack",
    logo: "/slack.svg",
    description: "Monitor workspace channels, summarize threads, catch urgent mentions, and dispatch automated status updates.",
    category: "Team Workspace",
    badge: "Official App",
    isPopular: true,
    mcpServer: "mcp/slack-server",
    mcpProtocol: "JSON-RPC 2.0 / Webhook",
    tools: [
      {
        name: "slack_fetch_messages",
        displayName: "Fetch Channel History",
        type: "read",
        description: "Read latest conversations, thread replies, and announcements from any joined channel.",
        parameters: [
          { name: "channelId", type: "string", description: "Slack channel ID (e.g. C01234567)", optional: false },
          { name: "limit", type: "number", description: "Number of messages to retrieve", optional: true, default: 25 }
        ]
      },
      {
        name: "slack_post_message",
        displayName: "Post Channel Message",
        type: "write",
        description: "Publish briefings, task updates, or interactive message blocks to channels.",
        parameters: [
          { name: "channelId", type: "string", description: "Target channel ID", optional: false },
          { name: "text", type: "string", description: "Message body or markdown text", optional: false },
          { name: "threadTs", type: "string", description: "Thread timestamp to reply inside thread", optional: true }
        ]
      },
      {
        name: "slack_list_channels",
        displayName: "List Workspace Channels",
        type: "read",
        description: "List accessible public and private Slack channels in the workspace.",
        parameters: [
          { name: "types", type: "string", description: "Comma separated list of channel types", optional: true, default: "public_channel,private_channel" }
        ]
      },
      {
        name: "slack_search_messages",
        displayName: "Search Messages & Mentions",
        type: "read",
        description: "Search workspace history for key topics, client names, and user mentions.",
        parameters: [
          { name: "query", type: "string", description: "Search query string", optional: false }
        ]
      }
    ]
  },
  {
    id: "outlook",
    name: "Outlook",
    logo: "/outlook.svg",
    description: "Sync Microsoft 365 Exchange mail and calendars to prioritize VIP requests and prevent schedule clashes.",
    category: "Microsoft 365",
    badge: "MS Graph",
    isPopular: true,
    mcpServer: "mcp/outlook-graph",
    mcpProtocol: "REST / MS Graph MCP",
    tools: [
      {
        name: "outlook_get_inbox",
        displayName: "Fetch Outlook Mail",
        type: "read",
        description: "Fetch emails from Microsoft 365 inbox with unread filters and category tags.",
        parameters: [
          { name: "folder", type: "string", description: "Target folder name", optional: true, default: "Inbox" },
          { name: "top", type: "number", description: "Number of emails to fetch", optional: true, default: 10 }
        ]
      },
      {
        name: "outlook_get_calendar_events",
        displayName: "Get Calendar Events",
        type: "read",
        description: "Retrieve upcoming meetings, calendar invites, and organizer details.",
        parameters: [
          { name: "daysAhead", type: "number", description: "Days ahead to look up", optional: true, default: 7 }
        ]
      },
      {
        name: "outlook_send_mail",
        displayName: "Send Outlook Mail",
        type: "write",
        description: "Dispatch outgoing mail via corporate Exchange server.",
        parameters: [
          { name: "toRecipients", type: "array", description: "Email addresses", optional: false },
          { name: "subject", type: "string", description: "Email subject line", optional: false },
          { name: "body", type: "string", description: "Email content", optional: false }
        ]
      },
      {
        name: "outlook_create_event",
        displayName: "Schedule Calendar Event",
        type: "write",
        description: "Create a new meeting on Microsoft 365 Calendar with Teams invite link.",
        parameters: [
          { name: "subject", type: "string", description: "Meeting title", optional: false },
          { name: "startDateTime", type: "string", description: "ISO 8601 start date", optional: false },
          { name: "endDateTime", type: "string", description: "ISO 8601 end date", optional: false }
        ]
      }
    ]
  },
  {
    id: "discord",
    name: "Discord",
    logo: "/discord.svg",
    description: "Aggregate community server announcements, extract key developer updates, and track direct mentions.",
    category: "Community & Chat",
    badge: "Bot Gateway",
    mcpServer: "mcp/discord-bot",
    mcpProtocol: "Discord Gateway v10",
    tools: [
      {
        name: "discord_read_channel",
        displayName: "Read Channel Messages",
        type: "read",
        description: "Fetch recent messages, attachments, and pinned notices from a Discord channel.",
        parameters: [
          { name: "channelId", type: "string", description: "Snowflake channel ID", optional: false },
          { name: "limit", type: "number", description: "Number of messages (1-100)", optional: true, default: 50 }
        ]
      },
      {
        name: "discord_list_guilds",
        displayName: "List Joined Servers",
        type: "read",
        description: "List all guilds and server channels accessible by the agent bot.",
        parameters: []
      },
      {
        name: "discord_send_message",
        displayName: "Post Discord Message",
        type: "write",
        description: "Dispatch automated notification embed or message to a designated channel.",
        parameters: [
          { name: "channelId", type: "string", description: "Target channel ID", optional: false },
          { name: "content", type: "string", description: "Message content or embeds", optional: false }
        ]
      }
    ]
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    logo: "/linkedin.svg",
    description: "Filter recruit outreach, track VIP messages in InMail, and surface important updates from your network.",
    category: "Professional Network",
    badge: "Official OAuth",
    mcpServer: "mcp/linkedin-gateway",
    mcpProtocol: "LinkedIn REST / OpenID",
    tools: [
      {
        name: "linkedin_fetch_messages",
        displayName: "Fetch InMail & DMs",
        type: "read",
        description: "Retrieve direct conversation threads, recruiter messages, and connection requests.",
        parameters: [
          { name: "count", type: "number", description: "Messages to fetch", optional: true, default: 10 }
        ]
      },
      {
        name: "linkedin_send_message",
        displayName: "Send InMail Reply",
        type: "write",
        description: "Dispatch outreach or polite decline replies to pending recruiter inquiries.",
        parameters: [
          { name: "conversationId", type: "string", description: "Target conversation identifier", optional: false },
          { name: "body", type: "string", description: "Message text", optional: false }
        ]
      },
      {
        name: "linkedin_get_network_updates",
        displayName: "Get Priority Network Feed",
        type: "read",
        description: "Surface funding announcements, job promotions, and company updates from priority connections.",
        parameters: []
      }
    ]
  },
  {
    id: "telegram",
    name: "Telegram",
    logo: "/telegram.svg",
    description: "Condense high-frequency crypto and news channels into structured bullet points with keyword alerts.",
    category: "Instant Messaging",
    badge: "Bot API 7.0",
    mcpServer: "mcp/telegram-client",
    mcpProtocol: "MTProto / Bot API",
    tools: [
      {
        name: "telegram_get_updates",
        displayName: "Fetch Channel Updates",
        type: "read",
        description: "Retrieve new messages, channel broadcasts, and media captions.",
        parameters: [
          { name: "chatId", type: "string", description: "Chat or Channel username (@channel)", optional: true },
          { name: "limit", type: "number", description: "Maximum messages to fetch", optional: true, default: 30 }
        ]
      },
      {
        name: "telegram_send_message",
        displayName: "Send Alert or Digest",
        type: "write",
        description: "Send instant summary broadcasts or critical alerts to your personal Telegram chat.",
        parameters: [
          { name: "chatId", type: "string", description: "Target user or group ID", optional: false },
          { name: "text", type: "string", description: "Message text formatted in markdown", optional: false }
        ]
      },
      {
        name: "telegram_list_dialogs",
        displayName: "List Subscribed Chats",
        type: "read",
        description: "List subscribed channels, supergroups, and active chats.",
        parameters: []
      }
    ]
  },
  {
    id: "notion",
    name: "Notion",
    logo: "/notion.svg",
    description: "Sync workspace databases, append daily executive briefings, and auto-populate actionable project tasks.",
    category: "Productivity & Docs",
    badge: "Official API",
    mcpServer: "mcp/notion-server",
    mcpProtocol: "Notion API v2",
    tools: [
      {
        name: "notion_query_database",
        displayName: "Query Task Database",
        type: "read",
        description: "Query project tasks, sprint items, or meeting notes from Notion tables.",
        parameters: [
          { name: "databaseId", type: "string", description: "Notion database UUID", optional: false },
          { name: "filter", type: "object", description: "Status or property filter object", optional: true }
        ]
      },
      {
        name: "notion_create_page",
        displayName: "Create Briefing Page",
        type: "write",
        description: "Write agent briefings, meeting summaries, or research dossiers to Notion docs.",
        parameters: [
          { name: "parentPageId", type: "string", description: "Parent page or database ID", optional: false },
          { name: "title", type: "string", description: "Page title", optional: false },
          { name: "contentMarkdown", type: "string", description: "Page body content in markdown", optional: false }
        ]
      },
      {
        name: "notion_search",
        displayName: "Search Workspace Knowledge",
        type: "read",
        description: "Full-text search across all accessible Notion workspace pages and databases.",
        parameters: [
          { name: "query", type: "string", description: "Keyword search phrase", optional: false }
        ]
      }
    ]
  },
  {
    id: "github",
    name: "GitHub",
    logo: "/github.svg",
    description: "Track pull request reviews, summarize commit diffs, and catch failed CI/CD workflow runs automatically.",
    category: "Developer Tools",
    badge: "GitHub Apps",
    mcpServer: "mcp/github-server",
    mcpProtocol: "GitHub REST / GraphQL",
    tools: [
      {
        name: "github_list_notifications",
        displayName: "List Review Requests & Mentions",
        type: "read",
        description: "Fetch pending code review requests, issue mentions, and repository release notifications.",
        parameters: [
          { name: "unreadOnly", type: "boolean", description: "Filter only unread notices", optional: true, default: true }
        ]
      },
      {
        name: "github_get_pull_request",
        displayName: "Summarize Pull Request Diffs",
        type: "read",
        description: "Fetch code changes, review discussion, and CI checks for a specific PR.",
        parameters: [
          { name: "repo", type: "string", description: "Owner/Repository (e.g. org/app)", optional: false },
          { name: "pullNumber", type: "number", description: "PR number", optional: false }
        ]
      },
      {
        name: "github_create_issue_comment",
        displayName: "Post PR Comment",
        type: "write",
        description: "Post automated code analysis or status update to GitHub issues or pull requests.",
        parameters: [
          { name: "repo", type: "string", description: "Owner/Repository", optional: false },
          { name: "issueNumber", type: "number", description: "Issue or PR number", optional: false },
          { name: "body", type: "string", description: "Comment body", optional: false }
        ]
      }
    ]
  },
  {
    id: "twitter",
    name: "Twitter / X",
    logo: "/twitter.svg",
    description: "Monitor industry trends, curate targeted lists, and track brand mentions without timeline distraction.",
    category: "Social Media",
    badge: "X API v2",
    mcpServer: "mcp/twitter-api",
    mcpProtocol: "Twitter OAuth 2.0 / REST",
    tools: [
      {
        name: "twitter_search_recent",
        displayName: "Search Keyword Mentions",
        type: "read",
        description: "Search recent tweets and threads matching monitored brand or technology queries.",
        parameters: [
          { name: "query", type: "string", description: "Search query terms and operators", optional: false },
          { name: "maxResults", type: "number", description: "Max tweets to retrieve (10-100)", optional: true, default: 20 }
        ]
      },
      {
        name: "twitter_get_timeline",
        displayName: "Fetch Curated List Tweets",
        type: "read",
        description: "Read updates from a clean, custom-curated VIP list of founders and engineers.",
        parameters: [
          { name: "listId", type: "string", description: "X list identifier", optional: true }
        ]
      },
      {
        name: "twitter_post_tweet",
        displayName: "Publish Tweet / Reply",
        type: "write",
        description: "Publish an approved social briefing update or response.",
        parameters: [
          { name: "text", type: "string", description: "Tweet content (max 280 chars)", optional: false }
        ]
      }
    ]
  },
  {
    id: "gcalendar",
    name: "Google Calendar",
    logo: "/gcalendar.svg",
    description: "Synchronize meeting schedules, extract attendees, and prepare proactive research dossiers before calls.",
    category: "Google Workspace",
    badge: "Calendar v3",
    mcpServer: "mcp/gcalendar-server",
    mcpProtocol: "Google API / OAuth 2.0",
    tools: [
      {
        name: "gcalendar_list_events",
        displayName: "Fetch Upcoming Meetings",
        type: "read",
        description: "List scheduled meetings for today and tomorrow with attendee emails and Meet links.",
        parameters: [
          { name: "timeMin", type: "string", description: "Start time filter (ISO string)", optional: true },
          { name: "maxResults", type: "number", description: "Max events to retrieve", optional: true, default: 15 }
        ]
      },
      {
        name: "gcalendar_create_event",
        displayName: "Create Calendar Invite",
        type: "write",
        description: "Schedule a calendar event with automatic Google Meet video conference link.",
        parameters: [
          { name: "summary", type: "string", description: "Event summary/title", optional: false },
          { name: "startTime", type: "string", description: "Start time (ISO string)", optional: false },
          { name: "endTime", type: "string", description: "End time (ISO string)", optional: false },
          { name: "attendees", type: "array", description: "List of attendee email addresses", optional: true }
        ]
      },
      {
        name: "gcalendar_check_conflicts",
        displayName: "Detect Meeting Conflicts",
        type: "read",
        description: "Analyze calendar schedule for overlapping bookings and propose open buffer slots.",
        parameters: [
          { name: "targetDate", type: "string", description: "Date to evaluate (YYYY-MM-DD)", optional: true }
        ]
      }
    ]
  }
];
