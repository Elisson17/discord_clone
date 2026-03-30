import Collapsible, {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/Collapsible";
import { ChannelProp } from "@/models/channel";
import { ServerProp } from "@/models/server";
import { useVoice } from "@/providers/VoiceProvider";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Session } from "next-auth";
import { ChannelButton } from "./ChannelButton";

export function ServerChannelContent({
  server,
  selectedChannel,
  session,
  unreadCounts,
  onSelectChannel,
}: {
  server: ServerProp;
  selectedChannel: ChannelProp | null;
  session: Session | null;
  unreadCounts: Record<number, number>;
  onSelectChannel: (channel: ChannelProp) => void;
}) {
  const { activeChannel: activeVoiceChannel } = useVoice();

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <button className="flex items-center justify-between px-4 h-11.5 border-b border-[#1e1f22] shadow-sm hover:bg-[#35373c] transition-colors w-full text-left shrink-0">
        <span className="font-semibold text-[#dbdee1] text-sm truncate">
          {server.name}
        </span>
        <ChevronDown className="w-4 h-4 text-[#80848e] shrink-0" />
      </button>

      <div className="flex-1 overflow-y-auto px-2 py-2">
        {server.channels
          .filter((c) => c.channel_type !== 4 && !c.parent_id)
          .sort((a, b) => a.position - b.position)
          .map((channel) => (
            <ChannelButton
              key={channel.id}
              channel={channel}
              isSelected={selectedChannel?.id === channel.id}
              activeVoiceChannelId={activeVoiceChannel?.id ?? null}
              session={session}
              unreadCount={unreadCounts[channel.id]}
              onClick={() => onSelectChannel(channel)}
            />
          ))}

        {server.channels
          .filter((c) => c.channel_type === 4)
          .sort((a, b) => a.position - b.position)
          .map((cat) => {
            const children = server.channels
              .filter((c) => c.parent_id === cat.id)
              .sort((a, b) => a.position - b.position);
            return (
              <Collapsible
                key={cat.id}
                storageKey={`server-${server.id}-cat-${cat.id}`}
                className="mt-4"
              >
                <CollapsibleTrigger className="flex items-center gap-1 px-1 mb-1 w-full group">
                  <ChevronRight className="w-3 h-3 text-[#80848e] transition-transform duration-150 group-data-[state=open]:rotate-90" />
                  <span className="text-xs font-semibold text-[#80848e] tracking-wide truncate">
                    {cat.name}
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {children.map((channel) => (
                    <ChannelButton
                      key={channel.id}
                      channel={channel}
                      isSelected={selectedChannel?.id === channel.id}
                      activeVoiceChannelId={activeVoiceChannel?.id ?? null}
                      session={session}
                      onClick={() => onSelectChannel(channel)}
                    />
                  ))}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
      </div>
    </div>
  );
}
