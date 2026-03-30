import { ChannelProp } from "@/models/channel";
import { useVoice } from "@/providers/VoiceProvider";
import { useParticipants } from "@livekit/components-react";
import {
  Headphones,
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { ParticipantTile } from "./ParticipantTile";

export function VoiceRoomContent({ channel }: { channel: ChannelProp }) {
  const { muted, deafened, setMuted, setDeafened, leaveCall } = useVoice();

  const participants = useParticipants();

  function toggleMute() {
    setMuted(!muted);
  }

  function toggleDeafen() {
    const next = !deafened;
    setDeafened(next);
    setMuted(next);
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <header className="flex items-center gap-2 px-4 h-12 border-b border-[#1e1f22] shrink-0 shadow-sm">
        <Volume2 className="w-5 h-5 text-[#80848e]" />
        <span className="font-semibold text-sm text-[#dbdee1]">
          {channel.name}
        </span>
        <span className="ml-1 text-xs text-[#80848e] bg-[#2b2d31] px-2 py-0.5 rounded-full">
          Voz
        </span>
      </header>

      <div className="flex-1 flex flex-wrap gap-8 content-center items-center justify-center p-8 overflow-y-auto">
        {participants.length === 0 ? (
          <p className="text-[#80848e] text-sm">Aguardando participantes...</p>
        ) : (
          participants.map((participant) => (
            <ParticipantTile
              key={participant.identity}
              participant={participant}
            />
          ))
        )}
      </div>

      <div className="flex items-center justify-center gap-3 py-5 border-t border-[#1e1f22] shrink-0 bg-[#2b2d31]">
        <button
          onClick={toggleMute}
          title={muted ? "Reativar microfone" : "Silenciar"}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            muted
              ? "bg-[#f23f43] text-white hover:bg-[#d83c3f]"
              : "bg-[#404249] text-[#dbdee1] hover:bg-[#4e5058]"
          }`}
        >
          {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleDeafen}
          title={deafened ? "Reativar som" : "Desativar som"}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            deafened
              ? "bg-[#f23f43] text-white hover:bg-[#d83c3f]"
              : "bg-[#404249] text-[#dbdee1] hover:bg-[#4e5058]"
          }`}
        >
          {deafened ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Headphones className="w-5 h-5" />
          )}
        </button>

        <button
          onClick={leaveCall}
          title="Sair da chamada"
          className="w-12 h-12 rounded-full bg-[#f23f43] text-white hover:bg-[#d83c3f] flex items-center justify-center transition-colors"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
