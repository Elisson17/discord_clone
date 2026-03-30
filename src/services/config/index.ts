import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];
let cachedToken: string | null = null;

function drainQueue(token: string) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
} | null> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

api.interceptors.request.use(async (config) => {
  if (config.headers.Authorization) return config;

  if (cachedToken) {
    config.headers.Authorization = `Bearer ${cachedToken}`;
    return config;
  }

  const session = await getSession();

  if (session?.error === "RefreshTokenError") {
    await signOut({ redirect: true, callbackUrl: "/login" });
    return Promise.reject(new Error("Session expired"));
  }

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Outro request já está fazendo o refresh — aguarda na fila
        return new Promise<string>((resolve) => {
          refreshQueue.push(resolve);
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const session = await getSession();

        if (!session?.refreshToken) {
          await signOut({ redirect: true, callbackUrl: "/login" });
          return Promise.reject(error);
        }

        const refreshed = await refreshAccessToken(session.refreshToken);

        if (!refreshed) {
          await signOut({ redirect: true, callbackUrl: "/login" });
          return Promise.reject(error);
        }

        cachedToken = refreshed.access_token;
        drainQueue(refreshed.access_token);
        originalRequest.headers.Authorization = `Bearer ${refreshed.access_token}`;
        return api(originalRequest);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
