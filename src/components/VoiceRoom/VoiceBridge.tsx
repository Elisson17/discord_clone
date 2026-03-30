import { useVoice } from "@/providers/VoiceProvider";
import {
  useConnectionState,
  useLocalParticipant,
} from "@livekit/components-react";
import { useEffect } from "react";
import { ConnectionState } from "livekit-client";

export function VoiceBridge() {
  const { muted } = useVoice();
  const { localParticipant } = useLocalParticipant();
  const connectionState = useConnectionState();

  useEffect(() => {
    if (connectionState !== ConnectionState.Connected) return;
    localParticipant.setMicrophoneEnabled(!muted).catch(console.error);
  }, [muted, localParticipant, connectionState]);

  return null;
}
