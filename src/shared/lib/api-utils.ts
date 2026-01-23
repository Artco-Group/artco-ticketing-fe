import type { AxiosError } from 'axios';

/**
 * Error types for classification
 */
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  CLIENT_ERROR = 'CLIENT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Extended AxiosError with classification metadata
 */
export interface ClassifiedError extends AxiosError {
  errorType: ErrorType;
  isRetryable: boolean;
  syncMessage: string;
}

/**
 * Classify an axios error for smart retry logic and error handling
 */
export function classifyError(error: AxiosError): ClassifiedError {
  const classifiedError = error as ClassifiedError;

  // Network errors (no response received)
  if (!error.response) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      classifiedError.errorType = ErrorType.TIMEOUT_ERROR;
      classifiedError.isRetryable = true;
      classifiedError.syncMessage = 'Request timed out. Please try again.';
    } else {
      classifiedError.errorType = ErrorType.NETWORK_ERROR;
      classifiedError.isRetryable = true;
      classifiedError.syncMessage =
        'Network error. Please check your connection.';
    }
    return classifiedError;
  }

  const status = error.response.status;
  const responseData = error.response.data as { message?: string };

  // Server errors (5xx) - retryable
  if (status >= 500) {
    classifiedError.errorType = ErrorType.SERVER_ERROR;
    classifiedError.isRetryable = true;
    classifiedError.syncMessage =
      responseData?.message || 'Server error. Please try again later.';
    return classifiedError;
  }

  // Authentication errors (401, 403)
  if (status === 401 || status === 403) {
    classifiedError.errorType = ErrorType.AUTH_ERROR;
    classifiedError.isRetryable = false;
    classifiedError.syncMessage =
      responseData?.message || 'Authentication required.';
    return classifiedError;
  }

  // Rate limiting (429)
  if (status === 429) {
    classifiedError.errorType = ErrorType.CLIENT_ERROR;
    classifiedError.isRetryable = true;
    classifiedError.syncMessage =
      'Too many requests. Please wait and try again.';
    return classifiedError;
  }

  // Client errors (4xx) - not retryable
  if (status >= 400 && status < 500) {
    classifiedError.errorType = ErrorType.CLIENT_ERROR;
    classifiedError.isRetryable = false;
    classifiedError.syncMessage =
      responseData?.message || 'Invalid request. Please check your input.';
    return classifiedError;
  }

  // Unknown error
  classifiedError.errorType = ErrorType.UNKNOWN_ERROR;
  classifiedError.isRetryable = false;
  classifiedError.syncMessage = 'An unexpected error occurred.';
  return classifiedError;
}

/**
 * Check if an error should be retried based on classification
 */
export function shouldRetry(
  error: unknown,
  failureCount: number,
  maxRetries: number = 3
): boolean {
  if (failureCount >= maxRetries) {
    return false;
  }

  const classifiedError = error as ClassifiedError;
  return classifiedError.isRetryable ?? false;
}

/**
 * Calculate retry delay with exponential backoff
 */
export function calculateRetryDelay(
  attemptIndex: number,
  baseDelay: number = 1000,
  maxDelay: number = 30000
): number {
  const exponentialDelay = Math.min(
    baseDelay * Math.pow(2, attemptIndex),
    maxDelay
  );
  // Add jitter to prevent thundering herd
  const jitter = exponentialDelay * 0.25 * (Math.random() * 2 - 1);
  return Math.max(exponentialDelay + jitter, 100);
}

/**
 * Extract a user-friendly error message from any error type
 * Handles ClassifiedError, AxiosError, Error, and string errors
 */
export function getErrorMessage(error: unknown): string {
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle ClassifiedError (already has syncMessage)
  if (error && typeof error === 'object' && 'syncMessage' in error) {
    return (error as ClassifiedError).syncMessage;
  }

  // Handle AxiosError with response
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as AxiosError<{ message?: string }>;

    // Try to get message from response data
    const responseMessage = axiosError.response?.data?.message;
    if (responseMessage) {
      return responseMessage;
    }

    // Map common HTTP status codes to user-friendly messages
    const status = axiosError.response?.status;
    if (status === 401) return 'Sesija je istekla. Molimo prijavite se ponovo.';
    if (status === 403) return 'Nemate dozvolu za ovu akciju.';
    if (status === 404) return 'Traženi resurs nije pronađen.';
    if (status === 422) return 'Podaci nisu validni.';
    if (status && status >= 500) return 'Došlo je do greške na serveru.';
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Fallback for unknown error types
  return 'Došlo je do neočekivane greške.';
}
