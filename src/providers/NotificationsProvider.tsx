"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { createConsumer } from "@rails/actioncable";
import { useSession } from "next-auth/react";

interface NotificationPayload {
  channel_id: number;
  server_id: number | null;
  channel_name: string;
  message_id: number;
  author: string;
  content: string;
}

interface NotificationsContextValue {
  unreadCounts: Record<number, number>;
  clearUnread: (channelId: number) => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationsProvider");
  return ctx;
}

export default function NotificationsProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});

  const clearUnread = useCallback((channelId: number) => {
    setUnreadCounts((prev) => {
      if (!prev[channelId]) return prev;
      const next = { ...prev };
      delete next[channelId];
      return next;
    });
  }, []);

  useEffect(() => {
    const token = session?.accessToken;
    if (!token) return;

    const cableUrl = `${process.env.NEXT_PUBLIC_CABLE_URL ?? "ws://localhost:3000/cable"}?token=${token}`;
    const consumer = createConsumer(cableUrl);

    const subscription = consumer.subscriptions.create("NotificationsChannel", {
      received(data: NotificationPayload) {
        setUnreadCounts((prev) => ({
          ...prev,
          [data.channel_id]: (prev[data.channel_id] ?? 0) + 1,
        }));
      },
    });

    return () => {
      subscription.unsubscribe();
      consumer.disconnect();
    };
  }, [session?.accessToken]);

  return (
    <NotificationsContext.Provider value={{ unreadCounts, clearUnread }}>
      {children}
    </NotificationsContext.Provider>
  );
}
