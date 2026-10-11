import { env } from "@/shared/config/env";
import { tokenStorage, type AuthTokens } from "../storage";
import { ApiError, NetworkError } from "./api-error";

export type RequestOptions = Omit<RequestInit, "body"> & {
  /** Plain objects are sent as JSON; FormData, Blob, etc. are sent as-is. */
  body?: unknown;
  /** Attach the access token and retry once after refreshing on 401. Defaults to true. */
  auth?: boolean;
};

let onSessionExpired: (() => void) | null = null;

/** Called when a 401 can't be recovered by refreshing the tokens. */
export function setSessionExpiredHandler(handler: (() => void) | null) {
  onSessionExpired = handler;
}

export async function apiRequest<T>(
  path: string,
  { auth = true, ...init }: RequestOptions = {}
): Promise<T> {
  let response = await send(
    path,
    init,
    auth ? tokenStorage.getAccessToken() : null
  );

  if (response.status === 401 && auth) {
    const accessToken = await refreshTokens();
    if (!accessToken) {
      onSessionExpired?.();
      throw await toApiError(response);
    }
    response = await send(path, init, accessToken);
  }

  if (!response.ok) throw await toApiError(response);
  return parseBody<T>(response);
}

async function send(
  path: string,
  {
    body,
    headers: initHeaders,
    method = "GET",
    ...init
  }: Omit<RequestOptions, "auth">,
  token: string | null
) {
  const headers = new Headers(initHeaders);
  headers.set("Accept", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const isRawBody =
    body instanceof FormData ||
    body instanceof Blob ||
    body instanceof URLSearchParams;
  if (body !== undefined && !isRawBody)
    headers.set("Content-Type", "application/json");

  try {
    return await fetch(toUrl(path), {
      ...init,
      method,
      headers,
      body:
        body === undefined
          ? undefined
          : isRawBody
            ? body
            : JSON.stringify(body),
    });
  } catch (cause) {
    // Let aborts propagate untouched so callers can ignore them.
    if (cause instanceof DOMException && cause.name === "AbortError")
      throw cause;
    throw new NetworkError(cause);
  }
}

const toUrl = (path: string) =>
  new URL(`${env.VITE_API_BASE_URL}${path}`, window.location.origin);

let inflightRefresh: Promise<string | null> | null = null;

/** Rotates the token pair. Concurrent 401s share a single refresh request. */
function refreshTokens(): Promise<string | null> {
  inflightRefresh ??= (async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) return null;
    try {
      const response = await fetch(toUrl("/auth/refresh"), {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      if (!response.ok) throw new Error("Refresh failed");
      const tokens = await parseBody<AuthTokens>(response);
      if (!tokens?.accessToken || !tokens.refreshToken)
        throw new Error("Invalid token response");
      tokenStorage.setTokens(tokens);
      return tokens.accessToken;
    } catch {
      tokenStorage.clearTokens();
      return null;
    }
  })().finally(() => {
    inflightRefresh = null;
  });
  return inflightRefresh;
}

async function parseBody<T>(response: Response): Promise<T> {
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

async function toApiError(response: Response) {
  const data: unknown = await parseBody(response).catch(() => null);
  const message =
    data &&
    typeof data === "object" &&
    "message" in data &&
    typeof data.message === "string"
      ? data.message
      : response.statusText || "Request failed";
  return new ApiError(response.status, message, data);
}

type MethodOptions = Omit<RequestOptions, "method" | "body">;

export const api = {
  get: <T>(path: string, options?: MethodOptions) =>
    apiRequest<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: MethodOptions) =>
    apiRequest<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: MethodOptions) =>
    apiRequest<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: MethodOptions) =>
    apiRequest<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: MethodOptions) =>
    apiRequest<T>(path, { ...options, method: "DELETE" }),
};
