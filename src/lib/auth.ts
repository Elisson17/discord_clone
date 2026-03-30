import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "@/services/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const EXPIRY_MARGIN_MS = 60 * 1000; // 1 min antes de expirar, já faz refresh

async function refreshAccessToken(refreshToken: string) {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return null;
    return res.json() as Promise<{ access_token: string; refresh_token: string }>;
  } catch {
    return null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const response = await login(credentials.email, credentials.password);

          return {
            id: String(response.id ?? ""),
            name: response.username,
            email: response.email,
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            username: response.username,
            discriminator: response.discriminator ?? "",
            avatar_url: response.avatar_url ?? null,
            bio: response.bio ?? null,
            mfa_enabled: response.mfa_enabled ?? false,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Primeiro login: popula o token com os dados do authorize()
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpiresAt = Date.now() + 15 * 60 * 1000;
        token.name = user.name;
        token.username = user.username;
        token.discriminator = user.discriminator;
        token.avatar_url = user.avatar_url;
        token.bio = user.bio;
        token.mfa_enabled = user.mfa_enabled;
        return token;
      }

      // Token ainda válido (com margem de segurança)
      if (token.accessTokenExpiresAt && Date.now() < token.accessTokenExpiresAt - EXPIRY_MARGIN_MS) {
        return token;
      }

      // Token expirado: faz refresh
      if (!token.refreshToken) return { ...token, error: "RefreshTokenError" as const };

      const refreshed = await refreshAccessToken(token.refreshToken);
      if (!refreshed) return { ...token, error: "RefreshTokenError" as const };

      return {
        ...token,
        accessToken: refreshed.access_token,
        refreshToken: refreshed.refresh_token,
        accessTokenExpiresAt: Date.now() + 15 * 60 * 1000,
        error: undefined,
      };
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.username = token.username ?? token.name ?? "";
        session.user.discriminator = token.discriminator ?? "";
        session.user.avatar_url = token.avatar_url ?? null;
        session.user.bio = token.bio ?? null;
        session.user.mfa_enabled = token.mfa_enabled ?? false;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 31 * 24 * 60 * 60, // 31 dias, alinhado com o refresh_token
  },
};
