import type { ApiResponse } from "@/shared/types";
import type { AuthUser, Token } from "../types/auth.types";
import type { LoginValues } from "../validations";

export interface AuthService {
  login: (data: LoginValues) => Promise<{ data: Token }>;
  refreshtoken: (
    refreshToken: string
  ) => Promise<{ accessToken: string; refreshToken: string }>;
  logout: (refreshToken: string | null) => Promise<unknown>;
  getProfile: () => ApiResponse<AuthUser>;
}
