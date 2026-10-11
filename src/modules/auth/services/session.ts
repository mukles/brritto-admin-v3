import {
  decodeJwt,
  isTokenExpired,
  localStorageService,
  cookieService,
} from "@/shared/services";
import { useAuthStore } from "../stores/auth.store";
import type { AuthUser } from "../types/auth.types";
import type { LoginValues } from "../validations";
import { authService } from "./auth-service";

function startSession(user: AuthUser) {
  localStorageService.setItem("user", user);
  useAuthStore.getState().setSession(user);
}

function endSession() {
  cookieService.removeCookie("accessToken");
  cookieService.removeCookie("refreshToken");
  localStorageService.removeItem("user");
  useAuthStore.getState().clearSession();
}

function userFromToken(accessToken: string): AuthUser {
  const claims = decodeJwt<AuthUser & { exp?: number }>(accessToken);
  if (!claims) throw new Error("Invalid access token");
  const { id, name, email, role, permissions } = claims;
  return { id, name, email, role, permissions };
}

export async function login(credentials: LoginValues): Promise<AuthUser> {
  const { data } = await authService.login(credentials);
  cookieService.setCookie("accessToken", data.access_token);
  cookieService.setCookie("refreshToken", data.refresh_token);
  const user = userFromToken(data.access_token);
  startSession(user);
  return user;
}

export async function logout() {
  try {
    await authService.logout(cookieService.getCookie("refreshToken"));
  } finally {
    endSession();
  }
}

export function initAuth() {
  const user: AuthUser | null = localStorageService.getItem("user");
  const refreshToken: string | null = cookieService.getCookie("refreshToken");
  if (user && refreshToken && !isTokenExpired(refreshToken)) {
    useAuthStore.getState().setSession(user);
  } else {
    endSession();
  }
}
