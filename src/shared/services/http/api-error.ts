export class ApiError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(status: number, message: string, data: unknown = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/** Thrown when the request never reached the server (offline, DNS, CORS). */
export class NetworkError extends Error {
  constructor(cause?: unknown) {
    super("No internet connection. Please check your network and try again.", {
      cause,
    });
    this.name = "NetworkError";
  }
}

export function toError(cause: unknown): Error {
  return cause instanceof Error ? cause : new Error(String(cause));
}

export function getErrorMessage(cause: unknown) {
  if (cause instanceof ApiError || cause instanceof NetworkError)
    return cause.message;
  return "Something went wrong. Please try again.";
}
