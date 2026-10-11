import { http, HttpResponse } from "msw";
import {
  findUserByEmail,
  findUserById,
  toAuthUser,
  DEMO_PASSWORD,
} from "../db";
import {
  issueAccessToken,
  issueRefreshToken,
  revokeUserRefreshTokens,
  rotateRefreshToken,
} from "../tokens";
import {
  apiUrl,
  authenticate,
  bearerToken,
  errorResponse,
  networkDelay,
} from "../utils";

export const authHandlers = [
  http.post(apiUrl("/auth/login"), async ({ request }) => {
    await networkDelay();
    const body = (await request.json().catch(() => null)) as {
      email?: unknown;
      password?: unknown;
    } | null;
    const user = findUserByEmail(body?.email);
    if (!user || body?.password !== DEMO_PASSWORD) {
      return errorResponse(401, "Invalid email or password");
    }
    return HttpResponse.json({
      accessToken: issueAccessToken(user.id),
      refreshToken: issueRefreshToken(user.id),
      user: toAuthUser(user),
    });
  }),

  // Mirrors the backend: the refresh token is sent as `Authorization: Bearer <refreshToken>`.
  http.post(apiUrl("/auth/refresh"), async ({ request }) => {
    await networkDelay();
    const rotated = rotateRefreshToken(bearerToken(request));
    if (!rotated || !findUserById(rotated.userId)) {
      return errorResponse(401, "Invalid or expired refresh token.");
    }
    return HttpResponse.json({
      accessToken: issueAccessToken(rotated.userId),
      refreshToken: rotated.refreshToken,
    });
  }),

  http.post(apiUrl("/auth/logout"), async ({ request }) => {
    await networkDelay();
    const { user, error } = authenticate(request);
    if (error) return error;
    revokeUserRefreshTokens(user.id);
    return HttpResponse.json({ message: "Logout successful." });
  }),
];
