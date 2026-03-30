import { ConversationProp } from "@/models/conversation";

export function dmPartner(conv: ConversationProp, currentUserId: number) {
  return (
    conv.participants.find((p) => p.id !== currentUserId) ??
    conv.participants[0]
  );
}
