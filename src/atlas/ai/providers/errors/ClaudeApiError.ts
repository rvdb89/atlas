export class ClaudeApiError extends Error {
  constructor(
    readonly code: "MISSING_API_KEY" | "TIMEOUT" | "INVALID_RESPONSE" | "PROVIDER_UNAVAILABLE" | "HTTP_ERROR",
    message: string,
    readonly statusCode?: number,
  ) {
    super(message);
    this.name = "ClaudeApiError";
  }
}

export function isClaudeApiError(error: unknown): error is ClaudeApiError {
  return error instanceof ClaudeApiError;
}
