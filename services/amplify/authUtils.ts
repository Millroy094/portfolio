import { getCurrentUser } from "aws-amplify/auth";

export async function verifyAuthentication(): Promise<void> {
  try {
    await getCurrentUser();
  } catch (error) {
    throw new Error("Authentication required. Please sign in to continue.", {
      cause: error,
    });
  }
}

const RETRY_CONFIG = {
  maxAttempts: 3,
  baseDelayMs: 500,
  maxDelayMs: 5000,
};

function getBackoffDelay(attempt: number): number {
  const delay = Math.min(RETRY_CONFIG.baseDelayMs * Math.pow(2, attempt), RETRY_CONFIG.maxDelayMs);
  const jitter = delay * 0.1 * (Math.random() * 2 - 1);
  return delay + jitter;
}

function isRateLimitError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message || "";
  const cause = error.cause;

  const hasCauseError =
    cause instanceof Error &&
    (cause.message.includes("TooManyRequests") || cause.message.includes("Rate exceeded"));

  return (
    message.includes("TooManyRequests") ||
    message.includes("Rate exceeded") ||
    message.includes("throttl") ||
    hasCauseError
  );
}

function isAuthError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message || "";
  const cause = error.cause;

  return (
    message.includes("NoSignedUser") ||
    message.includes("No current user") ||
    message.includes("NotAuthorizedException") ||
    message.includes("Authentication required") ||
    (cause instanceof Error && cause.message.includes("NoSignedUser"))
  );
}

export async function withAuthRetry<T>(
  operation: () => Promise<T>,
  operationName: string = "Operation",
): Promise<T> {
  await verifyAuthentication();

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < RETRY_CONFIG.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (isAuthError(error)) {
        throw lastError;
      }

      if (!isRateLimitError(error)) {
        throw lastError;
      }

      if (attempt === RETRY_CONFIG.maxAttempts - 1) {
        throw new Error(
          `${operationName} failed after ${RETRY_CONFIG.maxAttempts} attempts due to rate limiting. Please try again in a moment.`,
          { cause: lastError },
        );
      }

      const delay = getBackoffDelay(attempt);
      console.warn(
        `${operationName} rate limited. Retrying in ${Math.round(delay)}ms... (attempt ${attempt + 1}/${RETRY_CONFIG.maxAttempts})`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error(`${operationName} failed`);
}
