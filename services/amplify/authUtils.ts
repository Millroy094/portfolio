const RETRY_CONFIG = { maxAttempts: 5, baseDelayMs: 1000, maxDelayMs: 8000 };

function getBackoffDelay(attempt: number): number {
  const delay = Math.min(RETRY_CONFIG.baseDelayMs * Math.pow(2, attempt), RETRY_CONFIG.maxDelayMs);
  return delay + delay * 0.1 * (Math.random() * 2 - 1);
}

function isRateLimitError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const msg = error.message || "";
  const cause = error.cause as Error | null;
  const underlyingError = (error as { underlyingError?: Error }).underlyingError ?? null;

  return (
    msg.includes("TooManyRequests") ||
    msg.includes("Rate exceeded") ||
    msg.includes("throttl") ||
    (!!cause && cause.message.includes("TooManyRequests")) ||
    (!!cause && cause.message.includes("Rate exceeded")) ||
    (!!underlyingError && underlyingError.message.includes("TooManyRequests")) ||
    (!!underlyingError && underlyingError.message.includes("Rate exceeded"))
  );
}

export function isAuthExpiredError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const msg = error.message || "";
  const cause = error.cause as Error | null;
  const underlyingError = (error as { underlyingError?: Error }).underlyingError ?? null;
  const combined = `${msg} ${cause?.message ?? ""} ${underlyingError?.message ?? ""}`;

  return (
    combined.includes("NotAuthorizedException") ||
    combined.includes("Refresh Token has expired") ||
    combined.includes("Access Token has expired") ||
    combined.includes("NoSignedUser") ||
    combined.includes("No current user") ||
    combined.includes("Authentication required")
  );
}

export async function withAuthRetry<T>(
  operation: () => Promise<T>,
  operationName: string = "Operation",
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < RETRY_CONFIG.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (!isRateLimitError(error)) throw lastError;

      if (attempt === RETRY_CONFIG.maxAttempts - 1) {
        throw new Error(
          `${operationName} failed after ${RETRY_CONFIG.maxAttempts} attempts due to rate limiting. Please try again in a moment.`,
          { cause: lastError },
        );
      }

      const delay = getBackoffDelay(attempt);
      console.warn(`${operationName} rate limited. Retrying in ${Math.round(delay)}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error(`${operationName} failed`);
}
