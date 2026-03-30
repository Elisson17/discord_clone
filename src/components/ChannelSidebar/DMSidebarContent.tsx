import { ConversationProp } from "@/models/conversation";
import { Plus, Search, Users } from "lucide-react";
import Avatar from "../Avatar";
import { dmPartner } from "@/utils/ChannelContentUtils";

export function DMSidebarContent({
  conversations,
  activeConversation,
  currentUserId,
  onSelectConversation,
  onShowFriends,
}: {
  conversations: ConversationProp[];
  activeConversation: ConversationProp | null;
  currentUserId: number;
  onSelectConversation: (conv: ConversationProp) => void;
  onShowFriends: () => void;
}) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-2 pt-3">
        <button
          onClick={onShowFriends}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1] transition-colors"
        >
          <Users className="w-5 h-5 shrink-0" />
          Amigos
        </button>
      </div>

      <div className="p-2">
        <button className="w-full bg-[#1e1f22] text-[#949ba4] text-sm px-3 py-1.5 rounded text-left hover:bg-[#111214] transition-colors flex items-center gap-2">
          <Search className="w-3.5 h-3.5" />
          Buscar ou iniciar conversa
        </button>
      </div>

      <div className="px-4 py-1 mt-1 flex items-center justify-between">
        <span className="text-xs font-semibold text-[#80848e]  tracking-wide">
          Mensagens diretas
        </span>
        <button className="text-[#80848e] hover:text-[#dbdee1] transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 mt-1 flex flex-col gap-0.5">
        {conversations.map((conv) => {
          const partner = dmPartner(conv, currentUserId);
          const isActive = activeConversation?.id === conv.id;
          return (
            <button
              key={conv.id}
              onClick={() => onSelectConversation(conv)}
              className={`w-full flex items-center gap-3 px-2 py-2 rounded-md transition-colors text-left ${
                isActive
                  ? "bg-[#404249] text-[#dbdee1]"
                  : "text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]"
              }`}
            >
              <Avatar
                url={partner?.avatar_url ?? ""}
                name={partner?.username ?? "?"}
                size={32}
                status={partner?.status}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#dbdee1] truncate">
                  {partner?.username ?? conv.name}
                </p>
                {conv.last_message && (
                  <p className="text-xs text-[#949ba4] truncate">
                    {conv.last_message.content}
                  </p>
                )}
              </div>
            </button>
          );
        })}

        {conversations.length === 0 && (
          <p className="text-xs text-[#4e5058] text-center mt-6 px-4">
            Nenhuma conversa direta ainda.
          </p>
        )}
      </div>
    </div>
  );
}
