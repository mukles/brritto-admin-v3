import apiClient from "@/shared/services/api-client";
import type { AuthService } from "./type";

export const authService: AuthService = {
  login: (data) => {
    return apiClient.post("/auth/login", data);
  },
  refreshtoken: (refreshToken) => {
    return apiClient.post("/auth/refresh-token", { refreshToken });
  },
  logout: (refreshToken) => {
    return apiClient.post("/auth/logout", { refreshToken });
  },
  getProfile: () => {
    return apiClient.get("/auth/profile");
  },
};
