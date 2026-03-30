import { FriendProps } from "@/models/friend";
import api from "./config";

export const FriendService = {
  list() {
    return api.get<FriendProps>("/friends");
  },
};
