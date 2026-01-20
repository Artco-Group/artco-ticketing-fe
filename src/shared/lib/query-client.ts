import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { HttpStatus } from '@artco-group/artco-ticketing-sync/enums';
import { CACHE } from '@artco-group/artco-ticketing-sync/constants';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE.STALE_TIME,
      gcTime: CACHE.GC_TIME,
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof AxiosError && error.response) {
          const status = error.response.status;
          if (
            status >= HttpStatus.BAD_REQUEST &&
            status < HttpStatus.INTERNAL_SERVER_ERROR
          ) {
            return false;
          }
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
