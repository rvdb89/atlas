import { ProviderUnavailableError } from "../interfaces/provider";

export type RetryStrategy = {
  maxAttempts: number;
  initialBackoffMs: number;
  backoffMultiplier?: number;
  maxBackoffMs?: number;
  retryOnUnavailable?: boolean;
};

export type RetryExecutionResult<T> = {
  result: T;
  attempts: number;
};

const DEFAULT_STRATEGY: RetryStrategy = {
  maxAttempts: 3,
  initialBackoffMs: 250,
  backoffMultiplier: 2,
  maxBackoffMs: 4000,
  retryOnUnavailable: true,
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryable(error: unknown, strategy: RetryStrategy): boolean {
  if (!strategy.retryOnUnavailable) return false;
  return error instanceof ProviderUnavailableError;
}

export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  strategy: RetryStrategy = DEFAULT_STRATEGY,
): Promise<RetryExecutionResult<T>> {
  let attempt = 0;
  let backoff = strategy.initialBackoffMs;
  let lastError: Error | undefined;

  while (attempt < strategy.maxAttempts) {
    attempt += 1;
    try {
      const result = await operation();
      return { result, attempts: attempt };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt >= strategy.maxAttempts || !isRetryable(error, strategy)) {
        throw lastError;
      }
      await sleep(backoff);
      backoff = Math.min(
        strategy.maxBackoffMs ?? backoff * (strategy.backoffMultiplier ?? 2),
        backoff * (strategy.backoffMultiplier ?? 2),
      );
    }
  }

  throw lastError ?? new Error("Retry attempts exhausted");
}

export function getDefaultRetryStrategy(): RetryStrategy {
  return { ...DEFAULT_STRATEGY };
}
