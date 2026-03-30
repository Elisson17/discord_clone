"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerProp } from "@/models/server";
import { ChannelProp } from "@/models/channel";
import { ConversationProp } from "@/models/conversation";
import ServerBar from "@/components/ServerBar";
import VoiceRoom from "@/components/VoiceRoom";
import FriendsPanel from "./components/FriendsPanel";
import { useVoice } from "@/providers/VoiceProvider";
import { FriendService } from "@/services/friend";
import { ServerServices } from "@/services/server";
import { ConversationService } from "@/services/conversation";
import { MessageService } from "@/services/message";
import ChannelSidebar from "@/components/ChannelSidebar";
import ChatPanel from "@/components/chat";

type FriendsTab = "online" | "all" | "pending";

export default function ServerPage() {
  const { data: session } = useSession();
  const { activeChannel: activeVoiceChannel, joinChannel } = useVoice();

  const [selectedServer, setSelectedServer] = useState<ServerProp | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<ChannelProp | null>(
    null,
  );
  const [activeConversation, setActiveConversation] =
    useState<ConversationProp | null>(null);
  const [activeChannelId, setActiveChannelId] = useState<number | null>(null);
  const [view, setView] = useState<"home" | "server">("home");
  const [friendsTab, setFriendsTab] = useState<FriendsTab>("online");
  const [showVoiceRoomPanel, setShowVoiceRoomPanel] = useState(false);

  const currentUserId = Number(session?.user?.id ?? 0);

  const { data: serversData } = useQuery({
    queryKey: ["servers"],
    queryFn: () => ServerServices.list().then((r) => r.data),
  });

  console.log("Servers data:", serversData);

  const { data: conversationsData } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => ConversationService.list().then((r) => r.data),
  });

  console.log("Conversations data:", conversationsData);

  const { data: friendsData } = useQuery({
    queryKey: ["friends"],
    queryFn: () => FriendService.list().then((r) => r.data),
  });

  console.log("Friends data:", friendsData);

  const { data: messagesData, isLoading: loadingMessages } = useQuery({
    queryKey: ["messages", activeChannelId],
    queryFn: () =>
      MessageService.byChannel(activeChannelId!).then((r) => r.data),
    enabled: !!activeChannelId,
  });

  const queryClient = useQueryClient();
  const sendMessage = useMutation({
    mutationFn: (content: string) =>
      MessageService.create(activeChannelId!, content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", activeChannelId],
      });
    },
  });

  const servers = serversData?.servers ?? [];
  const conversations = conversationsData?.conversations ?? [];
  const messages = messagesData?.messages ?? [];

  async function handleSelectServer(s: ServerProp) {
    try {
      const r = await ServerServices.GetById(s.id);

      const full = r.data.server;
      setSelectedServer(full);
      setView("server");
      setActiveConversation(null);

      const firstText = full.channels
        .filter((c) => c.channel_type === 0)
        .sort((a, b) => a.position - b.position)[0];

      if (firstText) {
        setSelectedChannel(firstText);
        setActiveChannelId(firstText.id);
      } else {
        setSelectedChannel(null);
        setActiveChannelId(null);
      }
    } catch (e) {
      console.error(e);
    }
  }

  function handleSelectChannel(channel: ChannelProp) {
    if (channel.channel_type === 2) {
      if (activeVoiceChannel?.id === channel.id) {
        setShowVoiceRoomPanel((prev) => !prev);
      } else {
        joinChannel(channel);
        setShowVoiceRoomPanel(false);
      }
      return;
    }
    if (channel.channel_type !== 0) return;
    setShowVoiceRoomPanel(false);
    setSelectedChannel(channel);
    setActiveChannelId(channel.id);
  }

  function handleSelectConversation(conv: ConversationProp) {
    setActiveConversation(conv);
    setSelectedServer(null);
    setSelectedChannel(null);
    setActiveChannelId(conv.id);
    setView("home");
  }

  function goHome() {
    setView("home");
    setSelectedServer(null);
    setSelectedChannel(null);
    setActiveChannelId(null);
    setActiveConversation(null);
  }

  const dmPartner = activeConversation
    ? (activeConversation.participants.find((p) => p.id !== currentUserId) ??
      activeConversation.participants[0])
    : null;

  const activeName = selectedChannel
    ? selectedChannel.name
    : activeConversation
      ? (dmPartner?.username ?? activeConversation.name ?? "DM")
      : null;

  const effectiveShowPanel = showVoiceRoomPanel && !!activeVoiceChannel;
  const showFriends =
    !effectiveShowPanel && view === "home" && !activeConversation;
  const showMessages =
    !effectiveShowPanel && !!(selectedChannel || activeConversation);

  return (
    <div className="flex h-screen w-screen overflow-hidden text-[#dbdee1]">
      <ServerBar
        servers={servers}
        selectedServerId={selectedServer?.id ?? null}
        view={view}
        onSelectServer={handleSelectServer}
        onGoHome={goHome}
      />

      <ChannelSidebar
        view={view}
        selectedServer={selectedServer}
        selectedChannel={selectedChannel}
        conversations={conversations}
        activeConversation={activeConversation}
        currentUserId={currentUserId}
        session={session}
        onSelectChannel={handleSelectChannel}
        onSelectConversation={handleSelectConversation}
        onShowFriends={goHome}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-[#313338]">
        {activeVoiceChannel && (
          <div
            className={
              effectiveShowPanel ? "flex-1 flex flex-col min-w-0" : "hidden"
            }
          >
            <VoiceRoom
              channel={activeVoiceChannel}
              userId={String(currentUserId)}
              userName={session?.user?.username ?? ""}
              avatarUrl={session?.user?.avatar_url}
            />
          </div>
        )}
        {!effectiveShowPanel &&
          (showFriends ? (
            <FriendsPanel
              friends={friendsData}
              friendsTab={friendsTab}
              onTabChange={setFriendsTab}
            />
          ) : showMessages ? (
            <ChatPanel
              messages={messages}
              isLoading={loadingMessages}
              selectedChannel={selectedChannel}
              activeConversation={activeConversation}
              view={view}
              activeName={activeName}
              dmPartnerAvatar={dmPartner?.avatar_url}
              dmPartnerStatus={dmPartner?.status}
              onSendMessage={(content) => sendMessage.mutate(content)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#80848e] gap-4">
              <div className="text-8xl">👋</div>
              <p className="text-lg font-semibold text-[#dbdee1]">Bem-vindo!</p>
              <p className="text-sm">
                Selecione um servidor ou uma conversa para começar.
              </p>
            </div>
          ))}
      </main>
    </div>
  );
}
