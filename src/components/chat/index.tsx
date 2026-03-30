import { Hash, Paperclip, Smile } from "lucide-react";
import Input from "../Input";
import { Spinner } from "../ui/spinner";
import Avatar from "../Avatar";
import { useEffect, useRef, useState } from "react";
import { MessageProp } from "@/models/message";
import { ChannelProp } from "@/models/channel";
import { ConversationProp } from "@/models/conversation";
import { MessageList } from "./MessageList";

interface ChatPanelProps {
  messages: MessageProp[];
  isLoading: boolean;
  selectedChannel: ChannelProp | null;
  activeConversation: ConversationProp | null;
  view: "home" | "server";
  activeName: string | null;
  dmPartnerAvatar?: string;
  dmPartnerStatus?: number;
  onSendMessage: (content: string) => void;
}

export default function ChatPanel({
  messages,
  isLoading,
  selectedChannel,
  activeConversation,
  view,
  activeName,
  dmPartnerAvatar,
  dmPartnerStatus,
  onSendMessage,
}: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <header className="flex items-center bg-[#111214] gap-2 px-4 h-12 border-b border-[#1e1f22] shadow-sm shrink-0">
        {view === "server" ? (
          <Hash className="w-5 h-5 text-[#80848e] shrink-0" />
        ) : (
          activeConversation && (
            <Avatar
              url={dmPartnerAvatar ?? ""}
              name={activeName ?? "DM"}
              size={24}
              status={dmPartnerStatus}
            />
          )
        )}
        <span className="font-semibold text-[#dbdee1] text-sm">
          {activeName}
        </span>
        {view === "server" && selectedChannel?.topic && (
          <>
            <div className="w-px h-5 bg-[#3f4147] mx-1" />
            <span className="text-xs text-[#80848e] truncate">
              {selectedChannel.topic}
            </span>
          </>
        )}
      </header>

      <div className="flex flex-col flex-1 min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center flex-1">
            <Spinner className="w-8 h-8 text-[#5865f2]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-[#80848e]">
            <p className="text-lg font-semibold">Sem mensagens aqui ainda</p>
            <p className="text-sm mt-1">
              Seja o primeiro a enviar uma mensagem!
            </p>
          </div>
        ) : (
          <div className="flex-1 bg-[#111214] overflow-y-auto px-4 py-4">
            <MessageList messages={messages} />
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="px-4 bg-[#111214] pb-2 pt-2 shrink-0">
          <div className="flex items-center gap-3 bg-[#383a40] rounded-lg px-4 py-3">
            <button
              className="text-[#80848e] hover:text-[#dbdee1] transition-colors shrink-0"
              title="Anexar arquivo"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <Input
              transparent
              type="text"
              placeholder={`Conversar em ${view === "server" ? `#${selectedChannel?.name ?? ""}` : `@${activeName ?? ""}`}`}
              className="flex-1 text-[#dbdee1]  text-sm  py-0"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && inputValue.trim()) {
                  e.preventDefault();
                  onSendMessage(inputValue.trim());
                  setInputValue("");
                }
              }}
            />
            <button
              className="text-[#80848e] hover:text-[#dbdee1] transition-colors shrink-0"
              title="Emoji"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
