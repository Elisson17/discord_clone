import { useIsSpeaking } from "@livekit/components-react";
import { useMemo } from "react";
import Avatar from "../Avatar";
import { MicOff } from "lucide-react";
import { Participant } from "livekit-client";

export function ParticipantTile({ participant }: { participant: Participant }) {
  const isSpeaking = useIsSpeaking(participant);
  const isMuted = !participant.isMicrophoneEnabled;

  const meta = useMemo(() => {
    try {
      return JSON.parse(participant.metadata ?? "{}") as {
        avatar_url?: string | null;
      };
    } catch {
      return {} as { avatar_url?: string | null };
    }
  }, [participant.metadata]);

  const displayName = participant.name ?? participant.identity;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`rounded-full p-0.5 transition-colors duration-150 ${
          isSpeaking ? "bg-[#23a559]" : "bg-transparent"
        }`}
      >
        <Avatar
          url={meta.avatar_url ?? undefined}
          name={displayName}
          size={80}
          className="rounded-full"
        />
      </div>

      <div className="flex items-center gap-1.5">
        {isMuted && <MicOff className="w-3 h-3 text-[#f23f43]" />}
        <span className="text-sm text-[#dbdee1] font-medium">
          {displayName}
        </span>
      </div>
    </div>
  );
}
