import { ConversationProp, ConversationProps } from "@/models/conversation";
import api from "./config";

export const ConversationService = {
  list() {
    return api.get<ConversationProps>("/conversations");
  },
  GetById(id: number) {
    return api.get<ConversationProp>(`/conversations/${id}`);
  },
};
