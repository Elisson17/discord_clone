import { ChannelProp } from "./channel";
import { MemberProp } from "./member";
import { RoleProp } from "./role";

export interface ServerProp {
  id: number;
  name: string;
  description: string;
  icon_url: string;
  banner_url: string;
  is_public: boolean;
  vanity_url: string;
  member_count: number;
  verification_level: number;
  default_notification: number;
  owner_id: number;
  system_channel_id: number;
  created_at: string;
  channels: ChannelProp[];
  roles: RoleProp[];
  members: MemberProp[];
}

export interface ServerProps {
  servers: ServerProp[];
}

export interface ServerResponseProp {
  server: ServerProp;
}
