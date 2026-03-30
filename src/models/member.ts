export interface MemberProp {
  id: number;
  username: string;
  discriminator: string;
  avatar_url: string | null;
  status: number;
  custom_status: string | null;
}
