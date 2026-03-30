import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    error?: "RefreshTokenError";
    user: {
      id: string;
      username: string;
      discriminator: string;
      avatar_url: string | null;
      bio: string | null;
      mfa_enabled: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    username?: string;
    discriminator?: string;
    avatar_url?: string | null;
    bio?: string | null;
    mfa_enabled?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiresAt?: number;
    error?: "RefreshTokenError";
    username?: string;
    discriminator?: string;
    avatar_url?: string | null;
    bio?: string | null;
    mfa_enabled?: boolean;
  }
}
