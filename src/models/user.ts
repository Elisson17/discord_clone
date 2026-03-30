export interface RegisterData {
  email: string;
  password: string;
  password_confirmation: string;
  username: string;
}

export interface UserProp {
  id: number;
  username: string;
  discriminator: string;
  avatar_url: string;
  status: number;
  custom_status?: string;
  bio?: string;
}
