export interface AmplifyError extends Error {
  underlyingError?: Error | null;
}

export function isAmplifyError(error: unknown): error is AmplifyError {
  return error instanceof Error;
}
