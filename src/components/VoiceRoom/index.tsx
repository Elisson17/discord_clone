import { ChannelProp } from "@/models/channel";
import { useVoice } from "@/providers/VoiceProvider";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import { useEffect, useState } from "react";
import { VoiceBridge } from "./VoiceBridge";
import { SpeakingBridge } from "./SpeakingBridge";
import { VoiceRoomContent } from "./VoiceRoomContent";

interface VoiceRoomProps {
  channel: ChannelProp;
  userId: string;
  userName: string;
  avatarUrl?: string | null;
}

export default function VoiceRoom({
  channel,
  userId,
  userName,
  avatarUrl,
}: VoiceRoomProps) {
  const { leaveCall } = useVoice();
  const [token, setToken] = useState<string>("");
  const [serverUrl, setServerUrl] = useState<string>("");
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({
      roomName: `channel-${channel.id}`,
      participantIdentity: userId,
      participantName: userName,
      metadata: JSON.stringify({ avatar_url: avatarUrl ?? null }),
    });

    fetch(`/api/livekit/token?${params}`)
      .then((r) => r.json())
      .then(({ serverUrl: url, participantToken: tkn, error: err }) => {
        if (err) throw new Error(err);
        setServerUrl(url);
        setToken(tkn);
      })
      .catch(() => setFetchError("Não foi possível obter o token da chamada."));
  }, [channel.id, userId, userName, avatarUrl]);

  if (fetchError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <p className="text-[#f23f43] text-sm">{fetchError}</p>
        <button
          onClick={leaveCall}
          className="px-4 py-2 bg-[#404249] rounded hover:bg-[#4e5058] text-sm text-[#dbdee1] transition-colors"
        >
          Voltar
        </button>
      </div>
    );
  }

  if (!token || !serverUrl) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[#80848e]">
          <div className="w-8 h-8 border-2 border-[#5865f2] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Conectando à chamada...</p>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      serverUrl={serverUrl}
      token={token}
      connect={true}
      audio={false}
      onDisconnected={leaveCall}
      className="flex-1 flex flex-col bg-[#313338] min-w-0"
    >
      <VoiceBridge />
      <SpeakingBridge />
      <VoiceRoomContent channel={channel} />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}
