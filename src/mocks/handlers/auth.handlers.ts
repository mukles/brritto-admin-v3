import { http, HttpResponse } from "msw";
import {
  DEMO_PASSWORD,
  findUserByEmail,
  findUserById,
  toAuthUser,
} from "../db";
import {
  issueAccessToken,
  issueRefreshToken,
  revokeUserRefreshTokens,
  rotateRefreshToken,
} from "../tokens";
import { apiUrl, authenticate, errorResponse, networkDelay } from "../utils";

const readBody = async (request: Request) =>
  (await request.json().catch(() => null)) as Record<string, unknown> | null;

export const authHandlers = [
  http.post(apiUrl("/auth/login"), async ({ request }) => {
    await networkDelay();
    const body = await readBody(request);
    const user = findUserByEmail(body?.email);
    if (!user || body?.password !== DEMO_PASSWORD) {
      return errorResponse(401, "Invalid email or password");
    }
    return HttpResponse.json({
      data: {
        access_token: issueAccessToken(toAuthUser(user)),
        refresh_token: issueRefreshToken(user.id),
      },
    });
  }),

  http.post(apiUrl("/auth/refresh-token"), async ({ request }) => {
    await networkDelay();
    const body = await readBody(request);
    const token =
      typeof body?.refreshToken === "string" ? body.refreshToken : undefined;
    const rotated = rotateRefreshToken(token);
    const user = rotated ? findUserById(rotated.userId) : undefined;
    if (!rotated || !user) {
      return errorResponse(401, "Invalid or expired refresh token.");
    }
    return HttpResponse.json({
      accessToken: issueAccessToken(toAuthUser(user)),
      refreshToken: rotated.refreshToken,
    });
  }),

  http.post(apiUrl("/auth/logout"), async ({ request }) => {
    await networkDelay();
    const { user, error } = authenticate(request);
    if (error) return error;
    revokeUserRefreshTokens(user.id);
    return HttpResponse.json({ data: null, message: "Logout successful." });
  }),

  http.get(apiUrl("/auth/profile"), async ({ request }) => {
    await networkDelay();
    const { user, error } = authenticate(request);
    if (error) return error;
    return HttpResponse.json({ data: user });
  }),
];
