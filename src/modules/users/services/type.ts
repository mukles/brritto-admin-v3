import type { RoutePagination } from "@/shared/constant";
import type { ApiResponse } from "@/shared/types";
import type { User } from "../types/user.types";

export interface UsersService {
  getUsers: (params: RoutePagination) => ApiResponse<User[]>;
}
