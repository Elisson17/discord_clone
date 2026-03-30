"use client";

import {
  MessageSquare,
  MoreHorizontal,
  Check,
  X,
  UserPlus,
  Users,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Avatar from "@/components/Avatar";
import { Spinner } from "@/components/ui/spinner";
import { FriendProps, FriendProp } from "@/models/friend";
import { statusLabel } from "@/utils/statusUtils";

type FriendsTab = "online" | "all" | "pending";

interface FriendsPanelProps {
  friends: FriendProps | undefined;
  friendsTab: FriendsTab;
  onTabChange: (tab: FriendsTab) => void;
}

export default function FriendsPanel({
  friends,
  friendsTab,
  onTabChange,
}: FriendsPanelProps) {
  const visibleFriends: FriendProp[] =
    friendsTab === "online"
      ? (friends?.friends ?? []).filter((f) => f.status === 0)
      : (friends?.friends ?? []);

  const pendingCount = friends?.pending_incoming.length ?? 0;

  return (
    <>
      <header className="flex items-center gap-2 px-4 h-12 border-b border-[#1e1f22] shadow-sm shrink-0">
        <Users className="w-5 h-5 text-[#80848e] shrink-0" />
        <span className="font-semibold text-[#dbdee1] text-sm">Amigos</span>
        <div className="w-px h-5 bg-[#3f4147] mx-1" />

        <div className="flex gap-1">
          {(["online", "all", "pending"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-3 py-0.5 rounded text-sm transition-colors ${
                friendsTab === tab
                  ? "bg-[#404249] text-white"
                  : "text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]"
              }`}
            >
              {tab === "online" ? (
                "Online"
              ) : tab === "all" ? (
                "Todos"
              ) : (
                <span className="flex items-center gap-1.5">
                  Pendente
                  {pendingCount > 0 && (
                    <span className="bg-[#f23f43] text-white text-xs rounded-full px-1.5 leading-5">
                      {pendingCount}
                    </span>
                  )}
                </span>
              )}
            </button>
          ))}

          <button className="ml-2 px-3 py-0.5 rounded text-sm bg-[#23a559] text-white hover:bg-[#1e8f4e] transition-colors flex items-center gap-1.5">
            <UserPlus className="w-4 h-4" />
            Adicionar amigo
          </button>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="ml-1 px-3 py-0.5 rounded text-sm bg-[#f23f43] text-white hover:bg-[#d83c3f] transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {!friends ? (
          <div className="flex items-center justify-center h-full">
            <Spinner className="w-8 h-8 text-[#5865f2]" />
          </div>
        ) : (
          <div className="flex flex-col">
            <p className="text-xs font-semibold text-[#80848e] uppercase px-4 py-3">
              {friendsTab === "online"
                ? `Online — ${visibleFriends.length}`
                : friendsTab === "all"
                  ? `Todos os amigos — ${visibleFriends.length}`
                  : `Pedidos recebidos — ${pendingCount}`}
            </p>

            {friendsTab === "pending" ? (
              <>
                {friends.pending_incoming.map((req) => (
                  <div
                    key={req.friendship_id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#35373c] border-t border-[#3f4147] mx-4 first:border-0"
                  >
                    <Avatar
                      url={req.user.avatar_url}
                      name={req.user.username}
                      size={40}
                      status={req.user.status}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[#dbdee1] font-medium text-sm">
                        {req.user.username}
                      </p>
                      <p className="text-[#949ba4] text-xs">
                        Pedido de amizade recebido
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="w-9 h-9 rounded-full bg-[#2b2d31] text-[#23a559] hover:bg-[#23a559] hover:text-white flex items-center justify-center transition-colors">
                        <Check className="w-4 h-4" />
                      </button>
                      <button className="w-9 h-9 rounded-full bg-[#2b2d31] text-[#f23f43] hover:bg-[#f23f43] hover:text-white flex items-center justify-center transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {pendingCount === 0 && (
                  <EmptyState message="Nenhum pedido de amizade pendente." />
                )}
              </>
            ) : (
              <>
                {visibleFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#35373c] border-t border-[#3f4147] mx-4 first:border-0 cursor-pointer group"
                  >
                    <Avatar
                      url={friend.avatar_url}
                      name={friend.username}
                      size={40}
                      status={friend.status}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[#dbdee1] font-medium text-sm">
                        {friend.username}
                      </p>
                      <p className="text-[#949ba4] text-xs truncate">
                        {friend.custom_status || statusLabel(friend.status)}
                      </p>
                    </div>
                    <div className="hidden group-hover:flex gap-2">
                      <button
                        className="w-9 h-9 rounded-full bg-[#2b2d31] text-[#80848e] hover:text-[#dbdee1] flex items-center justify-center transition-colors"
                        title="Enviar mensagem"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        className="w-9 h-9 rounded-full bg-[#2b2d31] text-[#80848e] hover:text-[#dbdee1] flex items-center justify-center transition-colors"
                        title="Mais opções"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {visibleFriends.length === 0 && (
                  <EmptyState
                    message={
                      friendsTab === "online"
                        ? "Nenhum amigo online no momento."
                        : "Você ainda não tem amigos adicionados."
                    }
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-8">
      <div className="text-8xl mb-4">👻</div>
      <p className="text-[#80848e] text-sm">{message}</p>
    </div>
  );
}
