import { useFetch } from "@/shared/hooks/use-fetch";
import { usersApi } from "../services/users.api";
import type { UsersQuery } from "../types/user.types";

export function useUsers(query: UsersQuery) {
  return useFetch((signal) => usersApi.list(query, signal), {}, [query]);
}
