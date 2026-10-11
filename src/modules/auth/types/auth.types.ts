import type { AuthTokens } from "@/shared/services/storage";

export const ROLES = ["admin", "manager", "viewer"] as const;
export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  "dashboard:view",
  "users:read",
  "users:write",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type DemoAccount = LoginCredentials & { role: Role };

export type AuthSession = AuthTokens & {
  user: AuthUser;
};
