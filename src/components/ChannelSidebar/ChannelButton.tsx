import { ChannelProp } from "@/models/channel";
import { Hash, Volume2 } from "lucide-react";
import { Session } from "next-auth";
import { VoiceMemberRow } from "./VoiceMemberRow";

export function ChannelButton({
  channel,
  isSelected,
  activeVoiceChannelId,
  session,
  unreadCount,
  onClick,
}: {
  channel: ChannelProp;
  isSelected: boolean;
  activeVoiceChannelId: number | null;
  session: Session | null;
  unreadCount?: number;
  onClick: () => void;
}) {
  const isVoice = channel.channel_type === 2;
  const isMeInThisChannel = isVoice && activeVoiceChannelId === channel.id;

  return (
    <div className="my-1">
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded text-sm transition-colors ${
          isSelected
            ? "bg-[#404249] text-white"
            : "text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]"
        }`}
      >
        {isVoice ? (
          <Volume2 className="w-4 h-4 shrink-0 text-[#80848e]" />
        ) : (
          <Hash className="w-4 h-4 shrink-0 text-[#80848e]" />
        )}
        <span className="truncate">{channel.name}</span>
        <span className="ml-auto flex items-center gap-1 shrink-0">
          {channel.is_nsfw && (
            <span className="text-[10px] text-[#f23f43] font-semibold">18+</span>
          )}
          {!!unreadCount && (
            <span className="bg-[#f23f43] text-white text-[10px] font-bold rounded-full min-w-4.5 h-4.5 flex items-center justify-center px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </span>
      </button>

      {isMeInThisChannel && session?.user && (
        <VoiceMemberRow session={session} />
      )}
    </div>
  );
}
