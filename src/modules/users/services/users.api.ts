import { api } from "@/shared/services/http";
import type { Paginated } from "@/shared/types/api";
import type { User, UsersQuery } from "../types/user.types";

export const usersApi = {
  list: ({ page, pageSize }: UsersQuery, signal?: AbortSignal) =>
    api.get<Paginated<User>>(`/users?page=${page}&pageSize=${pageSize}`, {
      signal,
    }),
};
