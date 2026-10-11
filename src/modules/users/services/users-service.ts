import apiClient from "@/shared/services/api-client";
import type { UsersService } from "./type";

export const usersService: UsersService = {
  getUsers: (params) => apiClient.get("/users", { params }),
};
