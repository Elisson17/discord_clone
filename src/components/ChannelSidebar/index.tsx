import { ChannelProp } from "@/models/channel";
import { ConversationProp } from "@/models/conversation";
import { ServerProp } from "@/models/server";
import { Session } from "next-auth";
import { DMSidebarContent } from "./DMSidebarContent";
import { ServerChannelContent } from "./ServerChannelContent";
import UserBar from "@/app/(server)/server/components/UserBar";

interface ChannelSidebarProps {
  view: "home" | "server";
  selectedServer: ServerProp | null;
  selectedChannel: ChannelProp | null;
  conversations: ConversationProp[];
  activeConversation: ConversationProp | null;
  currentUserId: number;
  session: Session | null;
  unreadCounts?: Record<number, number>;
  onSelectChannel: (channel: ChannelProp) => void;
  onSelectConversation: (conv: ConversationProp) => void;
  onShowFriends: () => void;
}

export default function ChannelSidebar({
  view,
  selectedServer,
  selectedChannel,
  conversations,
  activeConversation,
  currentUserId,
  session,
  unreadCounts,
  onSelectChannel,
  onSelectConversation,
  onShowFriends,
}: ChannelSidebarProps) {
  return (
    <aside
      className="shrink-0 bg-[#111214] border flex flex-col"
      style={{ width: 240 }}
    >
      {view === "home" ? (
        <DMSidebarContent
          conversations={conversations}
          activeConversation={activeConversation}
          currentUserId={currentUserId}
          onSelectConversation={onSelectConversation}
          onShowFriends={onShowFriends}
        />
      ) : (
        selectedServer && (
          <ServerChannelContent
            server={selectedServer}
            selectedChannel={selectedChannel}
            session={session}
            unreadCounts={unreadCounts!}
            onSelectChannel={onSelectChannel}
          />
        )
      )}

      <UserBar session={session} />
    </aside>
  );
}
