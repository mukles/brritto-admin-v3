import { create } from "zustand";
import type { AuthUser } from "../types/auth.types";

export type AuthStatus = "pending" | "authenticated" | "unauthenticated";

export type AuthState = {
  status: AuthStatus;
  user: AuthUser | null;
  setSession: (user: AuthUser) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  status: "pending",
  user: null,
  setSession: (user) => set({ status: "authenticated", user }),
  clearSession: () => set({ status: "unauthenticated", user: null }),
}));
