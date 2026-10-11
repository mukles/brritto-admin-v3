import { delay, HttpResponse } from "msw";
import type { Permission } from "@/modules/auth";
import { ENV } from "@/shared/constant";
import { findUserById, toAuthUser } from "./db";
import { verifyAccessToken } from "./tokens";

export const apiUrl = (path: string) => `${ENV.API_BASE_URL}${path}`;

export const networkDelay = () =>
  delay(import.meta.env.MODE === "test" ? 0 : 300);

export const errorResponse = (status: number, message: string) =>
  HttpResponse.json({ message }, { status });

export const bearerToken = (request: Request) =>
  request.headers.get("Authorization")?.replace(/^Bearer /, "");

export function authenticate(request: Request, permission?: Permission) {
  const token = bearerToken(request);
  const userId = token ? verifyAccessToken(token) : null;
  const user = userId ? findUserById(userId) : undefined;
  if (!user) return { error: errorResponse(401, "Not authenticated") };

  const authUser = toAuthUser(user);
  if (permission && !authUser.permissions.includes(permission)) {
    return { error: errorResponse(403, "Forbidden") };
  }
  return { user: authUser };
}
