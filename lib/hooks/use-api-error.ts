import { ApiError } from '@/lib/api/server-api-client';

/**
 * Extracts a human-readable error message from any thrown value.
 * Centralises the error.message || "fallback" pattern so it's consistent
 * across all onError callbacks and form catch blocks.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return fallback;
}

/**
 * Type guard for Spring's 422 Unprocessable Entity responses.
 * Use this in form catch blocks to decide whether to show the error
 * inline in the form (validation) vs. letting the toast handle it (other errors).
 */
export function isValidationError(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status === 422;
}
