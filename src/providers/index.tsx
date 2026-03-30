import React from "react";
import SessionProvider from "./SessionProvider";
import QueryProvider from "./QueryProvider";
import TooltipProvider from "./TooltipProvider";
import ThemeProvider from "./ThemeProvider";
import VoiceProvider from "./VoiceProvider";
import NotificationsProvider from "./NotificationsProvider";
import { Toaster } from "@/components/ui/sonner";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <QueryProvider>
          <VoiceProvider>
            <NotificationsProvider>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
            </NotificationsProvider>
          </VoiceProvider>
        </QueryProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
