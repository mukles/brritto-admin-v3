import { api } from "@/shared/services/http";
import type { AuthSession, LoginCredentials } from "../types/auth.types";

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthSession>("/auth/login", credentials, { auth: false }),
  logout: () => api.post<void>("/auth/logout"),
};
