import { useVoice } from "@/providers/VoiceProvider";
import { useIsSpeaking, useLocalParticipant } from "@livekit/components-react";
import { useEffect } from "react";

export function SpeakingBridge() {
  const { localParticipant } = useLocalParticipant();
  const isSpeaking = useIsSpeaking(localParticipant);
  const { setIsSpeaking } = useVoice();

  useEffect(() => {
    setIsSpeaking(isSpeaking);
  }, [isSpeaking, setIsSpeaking]);

  return null;
}
