import { toast } from "sonner";
import { isTokenExpired } from "@/shared/services/encryption";
import { setSessionExpiredHandler } from "@/shared/services/http";
import { localStorageService, tokenStorage } from "@/shared/services/storage";
import { useAuthStore } from "../stores/auth.store";
import { authApi } from "./auth.api";
import type { AuthUser, LoginCredentials } from "../types/auth.types";

let signedOut = false;

function startSession(user: AuthUser) {
  signedOut = false;
  localStorageService.setItem("user", user);
  useAuthStore.getState().setSession(user);
}

function endSession() {
  tokenStorage.clearTokens();
  localStorageService.removeItem("user");
  useAuthStore.getState().clearSession();
}

export async function login(credentials: LoginCredentials): Promise<AuthUser> {
  const { user, accessToken, refreshToken } = await authApi.login(credentials);
  tokenStorage.setTokens({ accessToken, refreshToken });
  startSession(user);
  return user;
}

export async function logout() {
  signedOut = true;
  try {
    await authApi.logout();
  } finally {
    endSession();
  }
}

/** Restores the session from storage. Expired access tokens are refreshed on the first 401. */
export function initAuth() {
  setSessionExpiredHandler(() => {
    const wasSignedIn = useAuthStore.getState().status === "authenticated";
    endSession();
    if (wasSignedIn && !signedOut)
      toast.error("Your session expired. Please sign in again.", {
        id: "session-expired",
      });
  });

  const user = localStorageService.getItem<AuthUser>("user");
  const refreshToken = tokenStorage.getRefreshToken();
  if (user && refreshToken && !isTokenExpired(refreshToken)) {
    useAuthStore.getState().setSession(user);
  } else {
    endSession();
  }
}
