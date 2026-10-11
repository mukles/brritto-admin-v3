import type { AuthUser, Permission } from "../types/auth.types";

export function hasPermission(user: AuthUser | null, permission: Permission) {
  return user?.permissions.includes(permission) ?? false;
}

export function hasAllPermissions(
  user: AuthUser | null,
  permissions: readonly Permission[]
) {
  return permissions.every((permission) => hasPermission(user, permission));
}

export function hasAnyPermission(
  user: AuthUser | null,
  permissions: readonly Permission[]
) {
  return permissions.some((permission) => hasPermission(user, permission));
}
