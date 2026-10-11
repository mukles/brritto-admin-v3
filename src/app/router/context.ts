import type { AuthState } from "@/modules/auth";

export type RouterContext = {
  auth: () => AuthState;
};
