"use client";

import { MessageCircle, Plus } from "lucide-react";
import Avatar from "@/components/Avatar";
import { ServerProp } from "@/models/server";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ServerBarProps {
  servers: ServerProp[];
  selectedServerId: number | null;
  view: "home" | "server";
  onSelectServer: (server: ServerProp) => void;
  onGoHome: () => void;
}

export default function ServerBar({
  servers,
  selectedServerId,
  view,
  onSelectServer,
  onGoHome,
}: ServerBarProps) {
  return (
    <nav
      className="shrink-0 bg-[#111214] flex flex-col items-center py-3 gap-2 overflow-y-auto"
      style={{ width: 72 }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onGoHome}
            className={`w-12 h-12 flex items-center justify-center transition-all duration-200 ${
              view === "home"
                ? "bg-[#5865f2] rounded-2xl"
                : "bg-[#313338] rounded-full hover:bg-[#5865f2] hover:rounded-2xl"
            }`}
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">Mensagens diretas</TooltipContent>
      </Tooltip>

      <div className="w-8 h-px bg-[#3f4147]" />

      {servers.map((s) => (
        <Tooltip key={s.id}>
          <TooltipTrigger asChild>
            <button
              onClick={() => onSelectServer(s)}
              className={`w-12 h-12 flex items-center justify-center transition-all duration-200 overflow-hidden shrink-0 ${
                selectedServerId === s.id
                  ? "rounded-2xl ring-2 ring-[#5865f2]"
                  : "rounded-full hover:rounded-2xl"
              }`}
            >
              {s.icon_url ? (
                <Avatar
                  url={s.icon_url}
                  name={s.name}
                  size={48}
                  className="rounded-none"
                />
              ) : (
                <div className="w-12 h-12 bg-[#313338] hover:bg-[#5865f2] flex items-center justify-center text-white text-sm font-semibold transition-colors">
                  {s.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">{s.name}</TooltipContent>
        </Tooltip>
      ))}

      <div className="w-8 h-px bg-[#3f4147]" />

      <Tooltip>
        <TooltipTrigger asChild>
          <button className="w-12 h-12 rounded-full hover:rounded-2xl bg-[#313338] hover:bg-[#23a559] flex items-center justify-center text-[#23a559] hover:text-white transition-all duration-200">
            <Plus className="w-6 h-6" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">Adicionar um servidor</TooltipContent>
      </Tooltip>
    </nav>
  );
}
