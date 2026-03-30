import { MessageProp, MessageProps } from "@/models/message";
import api from "./config";

export const MessageService = {
  list() {
    return api.get<MessageProps>("/messages");
  },
  byChannel(channelId: number) {
    return api.get<MessageProps>(`/channels/${channelId}/messages`);
  },
  create(channelId: number, content: string) {
    return api.post<MessageProp>(`/channels/${channelId}/messages`, {
      message: { content },
    });
  },
};
