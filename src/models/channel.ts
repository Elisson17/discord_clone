import { PermissionOverwrite } from "./permission_overwrite";

export interface ChannelProp {
  id: number;
  name: string;
  channel_type: number; // 0=text 2=voice 4=category
  position: number;
  parent_id: number | null;
  topic: string | null;
  is_nsfw: boolean;
  slowmode_seconds: number;
  bitrate: number | null;
  user_limit: number | null;
  permission_overwrites: PermissionOverwrite[];
}
