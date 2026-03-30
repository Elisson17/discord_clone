import { RegisterData } from "@/models/user";
import api from "./config";

export async function login(email: string, password: string) {
  const response = await api.post("/login", {
    user: { email, password },
  });
  return response.data;
}

export async function register(data: RegisterData) {
  const response = await api.post("/signup", { user: data });
  return response.data;
}

export async function logout() {
  await api.delete("/logout");
}
