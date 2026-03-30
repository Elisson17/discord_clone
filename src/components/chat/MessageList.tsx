import { MessageProp } from "@/models/message";
import { formatDate } from "@/utils/dateTimeUtils";
import { MessageItem } from "./MessageItem";

export function MessageList({ messages }: { messages: MessageProp[] }) {
  const groups: { date: string; items: MessageProp[] }[] = [];

  for (const msg of messages) {
    const date = formatDate(msg.created_at);
    if (groups.length === 0 || groups[groups.length - 1].date !== date) {
      groups.push({ date, items: [msg] });
    } else {
      groups[groups.length - 1].items.push(msg);
    }
  }

  return (
    <>
      {groups.map((group) => (
        <div key={group.date}>
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-[#3f4147]" />
            <span className="text-xs text-[#80848e] font-medium whitespace-nowrap">
              {group.date}
            </span>
            <div className="flex-1 h-px bg-[#3f4147]" />
          </div>

          {group.items.map((msg, i) => {
            const prev = group.items[i - 1];
            const grouped =
              prev?.author.id === msg.author.id &&
              new Date(msg.created_at).getTime() -
                new Date(prev.created_at).getTime() <
                5 * 60 * 1000;

            return <MessageItem key={msg.id} msg={msg} grouped={grouped} />;
          })}
        </div>
      ))}
    </>
  );
}
