import { UserProp } from "./user";

export interface ConversationProp {
  id: number;
  name: string | null;
  channel_type: number;
  created_at: string;
  updated_at: string;
  participants: UserProp[];
  last_message: {
    id: number;
    content: string;
    created_at: string;
    edited_at: string | null;
    author: UserProp;
  } | null;
}

export interface ConversationProps {
  conversations: ConversationProp[];
}
