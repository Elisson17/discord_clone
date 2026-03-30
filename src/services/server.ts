import { ServerProps, ServerResponseProp } from "@/models/server";
import api from "./config";

export const ServerServices = {
  list() {
    return api.get<ServerProps>("/servers");
  },
  GetById(id: number) {
    return api.get<ServerResponseProp>(`/servers/${id}`);
  },
};
