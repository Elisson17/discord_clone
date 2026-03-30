export interface MessageAuthorProp {
  id: number;
  username: string;
  discriminator: string;
  avatar_url: string;
  status: number;
}

export interface AttachmentProp {
  id: number;
  url: string;
  filename: string;
  content_type: string;
  size: number;
  width?: number;
  height?: number;
  thumbnail_url?: string;
}

export interface ReactionProp {
  emoji: string;
  count: number;
  is_custom: boolean;
  me: boolean;
}

export interface ReplyToProp {
  id: number;
  content: string;
  created_at: string;
  author: MessageAuthorProp;
}

export interface MessageProp {
  id: number;
  content: string;
  message_type: number;
  is_pinned: boolean;
  tts: string;
  embeds: string;
  mentions: string;
  created_at: string;
  channel_id: number;
  author: MessageAuthorProp;
  reply_to: ReplyToProp | null;
  attachments: AttachmentProp[];
  reactions: ReactionProp[];
}

export interface MessageProps {
  messages: MessageProp[];
}
