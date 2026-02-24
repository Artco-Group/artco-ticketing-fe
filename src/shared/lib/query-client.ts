import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { HttpStatus, CACHE } from '@artco-group/artco-ticketing-sync';
import { calculateRetryDelay } from './api-utils';

/**
 * Create and configure QueryClient with smart defaults
 * - Proper stale/gc times from centralized config
 * - Smart retry logic (don't retry 4xx)
 * - Exponential backoff with jitter
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: CACHE.STALE_TIME,
        gcTime: CACHE.GC_TIME,
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors (client errors)
          if (error instanceof AxiosError && error.response) {
            const status = error.response.status;
            // Don't retry auth errors
            if (
              status === HttpStatus.UNAUTHORIZED ||
              status === HttpStatus.FORBIDDEN
            ) {
              return false;
            }
            // Don't retry other client errors (except 429 rate limit)
            if (
              status >= HttpStatus.BAD_REQUEST &&
              status < HttpStatus.INTERNAL_SERVER_ERROR &&
              status !== 429
            ) {
              return false;
            }
          }
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => calculateRetryDelay(attemptIndex),
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
        networkMode: 'online',
      },
      mutations: {
        retry: (failureCount, error) => {
          // Only retry network/timeout errors for mutations
          if (error instanceof AxiosError) {
            if (!error.response) {
              // Network error - retry once
              return failureCount < 2;
            }
          }
          return false;
        },
        retryDelay: (attemptIndex) =>
          Math.min(1000 * Math.pow(2, attemptIndex), 5000),
        networkMode: 'online',
      },
    },
  });
}

// Default queryClient instance
export const queryClient = createQueryClient();
