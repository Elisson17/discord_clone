import { MessageProp } from "@/models/message";
import { formatTime } from "@/utils/dateTimeUtils";
import Avatar from "../Avatar";
import Image from "next/image";
import { Paperclip } from "lucide-react";

export function MessageItem({
  msg,
  grouped,
}: {
  msg: MessageProp;
  grouped: boolean;
}) {
  return (
    <div
      className={`flex gap-4 px-2 rounded hover:bg-[#2e3035] group ${
        grouped ? "mt-0.5 py-0.5" : "mt-4 py-1"
      }`}
    >
      {grouped ? (
        <div className="w-10 shrink-0 flex items-center justify-end">
          <span className="text-[10px] text-[#4e5058] opacity-0 group-hover:opacity-100 transition-opacity pr-1">
            {formatTime(msg.created_at)}
          </span>
        </div>
      ) : (
        <div className="shrink-0 mt-0.5">
          <Avatar
            url={msg.author.avatar_url}
            name={msg.author.username}
            size={40}
          />
        </div>
      )}

      <div className="flex-1 min-w-0">
        {!grouped && (
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="font-medium text-[#dbdee1] text-sm hover:underline cursor-pointer">
              {msg.author.username}
            </span>
            <span className="text-[10px] text-[#4e5058]">
              {formatTime(msg.created_at)}
            </span>
          </div>
        )}

        {msg.reply_to && (
          <div className="flex items-center gap-2 text-xs text-[#949ba4] mb-1">
            <div className="w-4 h-3 border-l-2 border-t-2 border-[#4e5058] rounded-tl ml-1 shrink-0" />
            <Avatar
              url={msg.reply_to.author.avatar_url}
              name={msg.reply_to.author.username}
              size={16}
            />
            <span className="font-medium text-[#c4c9d4]">
              {msg.reply_to.author.username}
            </span>
            <span className="truncate text-[#949ba4]">
              {msg.reply_to.content}
            </span>
          </div>
        )}

        <p className="text-[#dbdee1] text-sm leading-relaxed wrap-break-word">
          {msg.content}
        </p>

        {msg.attachments.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            {msg.attachments.map((att) =>
              att.content_type.startsWith("image/") ? (
                <Image
                  key={att.id}
                  src={att.url}
                  alt={att.filename}
                  className="rounded-md max-w-sm max-h-72 object-contain"
                />
              ) : (
                <a
                  key={att.id}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-[#2b2d31] rounded-md text-sm text-[#00a8fc] hover:underline max-w-xs"
                >
                  <Paperclip className="w-4 h-4 shrink-0" />
                  <span className="truncate">{att.filename}</span>
                </a>
              ),
            )}
          </div>
        )}

        {msg.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {msg.reactions.map((r) => (
              <button
                key={r.emoji}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs border transition-colors ${
                  r.me
                    ? "bg-[#5865f2]/20 border-[#5865f2] text-[#5865f2]"
                    : "bg-[#2b2d31] border-[#3f4147] text-[#dbdee1] hover:border-[#80848e]"
                }`}
              >
                <span>{r.emoji}</span>
                <span>{r.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
