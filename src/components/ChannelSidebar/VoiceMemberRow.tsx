import { useVoice } from "@/providers/VoiceProvider";
import { Session } from "next-auth";
import Avatar from "../Avatar";

export function VoiceMemberRow({ session }: { session: Session }) {
  const { isSpeaking } = useVoice();

  return (
    <div className="flex items-center gap-2 pl-8 pr-2 py-0.5">
      <div
        className={`rounded-full p-0.5 transition-colors duration-150 ${
          isSpeaking ? "bg-[#23a559]" : "bg-transparent"
        }`}
      >
        <Avatar
          url={session.user.avatar_url ?? ""}
          name={session.user.username ?? "?"}
          size={24}
          className="rounded-full"
        />
      </div>
      <span className="text-xs text-[#80848e] truncate">
        {session.user.username}
      </span>
    </div>
  );
}
