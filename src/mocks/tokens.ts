import type { AuthUser } from "@/modules/auth";

export const ACCESS_TOKEN_TTL_S = 15 * 60;
export const REFRESH_TOKEN_TTL_S = 7 * 24 * 60 * 60;

type RefreshRecord = {
  userId: string;
  familyId: string;
  expiresAt: number;
  used: boolean;
};

const STORE_KEY = "mock-api:refresh-tokens";

function loadStore(): Record<string, RefreshRecord> {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveStore(store: Record<string, RefreshRecord>) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {}
}

const base64Url = (value: object) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(value))))
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

export function issueAccessToken(user: AuthUser) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url({ alg: "none", typ: "JWT" });
  const payload = base64Url({
    sub: user.id,
    ...user,
    iat: now,
    exp: now + ACCESS_TOKEN_TTL_S,
  });
  return `${header}.${payload}.mock-signature`;
}

export function verifyAccessToken(token: string): string | null {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    if (typeof payload.sub !== "string" || payload.exp * 1000 < Date.now())
      return null;
    return payload.sub;
  } catch {
    return null;
  }
}

export function issueRefreshToken(
  userId: string,
  familyId: string = crypto.randomUUID()
) {
  const store = loadStore();
  const token = crypto.randomUUID();
  store[token] = {
    userId,
    familyId,
    expiresAt: Date.now() + REFRESH_TOKEN_TTL_S * 1000,
    used: false,
  };
  saveStore(store);
  return token;
}

export function rotateRefreshToken(token: string | undefined) {
  if (!token) return null;
  const store = loadStore();
  const record = store[token];
  if (!record || record.expiresAt < Date.now()) return null;

  if (record.used) {
    revokeFamily(record.familyId);
    return null;
  }

  record.used = true;
  saveStore(store);
  return {
    userId: record.userId,
    refreshToken: issueRefreshToken(record.userId, record.familyId),
  };
}

export function revokeUserRefreshTokens(userId: string) {
  const store = loadStore();
  for (const [token, record] of Object.entries(store)) {
    if (record.userId === userId) delete store[token];
  }
  saveStore(store);
}

function revokeFamily(familyId: string) {
  const store = loadStore();
  for (const [token, record] of Object.entries(store)) {
    if (record.familyId === familyId) delete store[token];
  }
  saveStore(store);
}
