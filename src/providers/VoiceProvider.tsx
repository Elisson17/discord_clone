"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ChannelProp } from "@/models/channel";

interface VoiceContextValue {
  activeChannel: ChannelProp | null;
  muted: boolean;
  deafened: boolean;
  isSpeaking: boolean;
  joinChannel: (channel: ChannelProp) => void;
  leaveCall: () => void;
  setMuted: (muted: boolean) => void;
  setDeafened: (deafened: boolean) => void;
  setIsSpeaking: (speaking: boolean) => void;
}

const VoiceContext = createContext<VoiceContextValue | null>(null);

export function useVoice() {
  const ctx = useContext(VoiceContext);
  if (!ctx) throw new Error("useVoice must be used inside VoiceProvider");
  return ctx;
}

export default function VoiceProvider({ children }: { children: ReactNode }) {
  const [activeChannel, setActiveChannel] = useState<ChannelProp | null>(null);
  const [muted, setMuted] = useState(false);
  const [deafened, setDeafened] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const joinChannel = useCallback((channel: ChannelProp) => {
    setActiveChannel(channel);
    setMuted(false);
    setDeafened(false);
  }, []);

  const leaveCall = useCallback(() => {
    setActiveChannel(null);
    setMuted(false);
    setDeafened(false);
  }, []);

  return (
    <VoiceContext.Provider
      value={{ activeChannel, muted, deafened, isSpeaking, joinChannel, leaveCall, setMuted, setDeafened, setIsSpeaking }}
    >
      {children}
    </VoiceContext.Provider>
  );
}
