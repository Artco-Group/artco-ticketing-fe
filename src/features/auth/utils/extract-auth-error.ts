import type { AxiosError } from 'axios';
import { extractErrorMessage } from '@artco-group/artco-ticketing-sync';

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

/**
 * Extracts a user-friendly error message from API errors.
 * Centralizes error handling logic for auth forms.
 *
 * @param err - The caught error from an API call
 * @returns A user-friendly error message string
 */
export function extractAuthError(err: unknown): string {
  const axiosError = err as AxiosError<ApiErrorResponse>;
  return (
    axiosError.response?.data?.message ||
    axiosError.response?.data?.error ||
    extractErrorMessage(err)
  );
}
