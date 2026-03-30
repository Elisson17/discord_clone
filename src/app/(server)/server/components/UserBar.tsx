"use client";

import {
  Settings,
  Mic,
  MicOff,
  Headphones,
  VolumeX,
  PhoneOff,
} from "lucide-react";
import Avatar from "@/components/Avatar";
import { Session } from "next-auth";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useVoice } from "@/providers/VoiceProvider";

interface UserBarProps {
  session: Session | null;
}

export default function UserBar({ session }: UserBarProps) {
  const user = session?.user;
  const { muted, deafened, setMuted, setDeafened, activeChannel, leaveCall } =
    useVoice();

  function toggleMute() {
    setMuted(!muted);
  }

  function toggleDeafen() {
    const next = !deafened;
    setDeafened(next);
    setMuted(next);
  }

  const inCall = !!activeChannel;

  return (
    <div className="flex items-center gap-2 p-2 bg-[#232428] shrink-0">
      <Avatar
        url={user?.avatar_url ?? ""}
        name={user?.username ?? "?"}
        size={32}
        status={0}
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#dbdee1] truncate">
          {user?.username}
        </p>
        <p className="text-xs text-[#80848e]">
          #{user?.discriminator ?? "0000"}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleMute}
              className={`p-1.5 rounded transition-colors ${
                muted
                  ? "bg-[#f23f43]/15 text-[#f23f43] hover:bg-[#f23f43]/25"
                  : "hover:bg-[#35373c] text-[#80848e] hover:text-[#dbdee1]"
              }`}
            >
              {muted ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            {muted ? "Reativar microfone" : "Silenciar microfone"}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleDeafen}
              className={`p-1.5 rounded transition-colors ${
                deafened
                  ? "bg-[#f23f43]/15 text-[#f23f43] hover:bg-[#f23f43]/25"
                  : "hover:bg-[#35373c] text-[#80848e] hover:text-[#dbdee1]"
              }`}
            >
              {deafened ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Headphones className="w-4 h-4" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            {deafened ? "Reativar som" : "Desativar som"}
          </TooltipContent>
        </Tooltip>

        {inCall && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={leaveCall}
                className="p-1.5 rounded transition-colors text-[#f23f43] hover:bg-[#f23f43]/15"
              >
                <PhoneOff className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Desconectar da chamada</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <button className="p-1.5 rounded hover:bg-[#35373c] text-[#80848e] hover:text-[#dbdee1] transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">Configurações de usuário</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
