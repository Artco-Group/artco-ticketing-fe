import {
  useQuery,
  useMutation,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query';
import type {
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { apiClient } from './api-client';
import type { AxiosRequestConfig } from 'axios';
import { CACHE } from '@artco-group/artco-ticketing-sync';
import {
  type ClassifiedError,
  ErrorType,
  calculateRetryDelay,
} from './api-utils';

/**
 * API Query options extending React Query options
 */
interface ApiQueryOptions<TData> extends Omit<
  UseQueryOptions<TData>,
  'queryKey' | 'queryFn'
> {
  url: string;
  params?: Record<string, unknown>;
  config?: AxiosRequestConfig;
}

/**
 * Enhanced useQuery wrapper with smart defaults
 * - Proper stale/gc times
 * - Smart retry logic (don't retry 4xx)
 * - Exponential backoff with jitter
 */
export function useApiQuery<TData>(
  queryKey: QueryKey,
  options: ApiQueryOptions<TData>
) {
  const { url, params, config, ...queryOptions } = options;

  return useQuery({
    queryKey: params ? [...queryKey, params] : queryKey,
    queryFn: async (): Promise<TData> => {
      try {
        const response = await apiClient.get<TData>(url, { params, ...config });
        return response.data;
      } catch (error: unknown) {
        // For /auth/me endpoint, 401 is expected when not logged in
        const axiosError = error as { response?: { status?: number } };
        if (url === '/auth/me' && axiosError?.response?.status === 401) {
          return null as TData;
        }
        throw error;
      }
    },
    staleTime: CACHE.STALE_TIME,
    gcTime: CACHE.GC_TIME,
    retry: (failureCount, error) => {
      const classifiedError = error as ClassifiedError;
      // Don't retry client errors (4xx except 429)
      if (classifiedError.errorType === ErrorType.CLIENT_ERROR) {
        return false;
      }
      // Don't retry auth errors
      if (classifiedError.errorType === ErrorType.AUTH_ERROR) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => calculateRetryDelay(attemptIndex),
    ...queryOptions,
  });
}

/**
 * API Mutation options extending React Query options
 */
interface ApiMutationOptions<
  TData,
  TVariables,
  TContext = unknown,
> extends Omit<
  UseMutationOptions<TData, Error, TVariables, TContext>,
  'mutationFn'
> {
  url: string | ((variables: TVariables) => string);
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  config?: AxiosRequestConfig;
}

/**
 * Enhanced useMutation wrapper
 * - Dynamic URL support
 * - Configurable HTTP method
 * - Error logging in development
 */
export function useApiMutation<TData, TVariables = void, TContext = unknown>(
  options: ApiMutationOptions<TData, TVariables, TContext>
) {
  const { url, method = 'POST', config, ...mutationOptions } = options;

  return useMutation({
    mutationFn: async (variables: TVariables): Promise<TData> => {
      const resolvedUrl = typeof url === 'function' ? url(variables) : url;
      const response = await apiClient.request<TData>({
        url: resolvedUrl,
        method,
        data: variables,
        ...config,
      });
      return response.data;
    },
    onError: (error: Error) => {
      if (import.meta.env.DEV) {
        const urlInfo = typeof url === 'function' ? '(dynamic URL)' : url;
        console.error(`Mutation failed: ${method} ${urlInfo}`, error.message);
      }
    },
    ...mutationOptions,
  });
}

/**
 * Context for optimistic mutation rollback
 */
interface OptimisticMutationContext<TData> {
  previousData: TData | undefined;
}

/**
 * Optimistic mutation options
 */
interface OptimisticMutationOptions<TData, TVariables> extends Omit<
  ApiMutationOptions<TData, TVariables, OptimisticMutationContext<TData>>,
  'onMutate' | 'onError' | 'onSettled'
> {
  optimisticUpdate?: (
    variables: TVariables,
    previousData: TData | undefined
  ) => TData;
  onMutate?: (variables: TVariables) => Promise<void> | void;
  onError?: (
    error: Error,
    variables: TVariables,
    context: OptimisticMutationContext<TData> | undefined
  ) => void;
  onSettled?: (
    data: TData | undefined,
    error: Error | null,
    variables: TVariables,
    context: OptimisticMutationContext<TData> | undefined
  ) => void;
}

/**
 * Enhanced mutation with optimistic updates
 * - Instant UI feedback
 * - Automatic rollback on error
 * - Cache invalidation on success
 */
export function useOptimisticMutation<TData, TVariables = void>(
  queryKey: QueryKey,
  options: OptimisticMutationOptions<TData, TVariables>
) {
  const queryClient = useQueryClient();
  const { optimisticUpdate, onMutate, onError, onSettled, ...mutationOptions } =
    options;

  return useApiMutation<TData, TVariables, OptimisticMutationContext<TData>>({
    ...mutationOptions,
    onMutate: async (
      variables: TVariables
    ): Promise<OptimisticMutationContext<TData>> => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<TData>(queryKey);

      // Optimistically update to the new value
      if (optimisticUpdate && previousData !== undefined) {
        const optimisticData = optimisticUpdate(variables, previousData);
        queryClient.setQueryData<TData>(queryKey, optimisticData);
      }

      // Call custom onMutate if provided
      if (onMutate) {
        await onMutate(variables);
      }

      return { previousData };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousData !== undefined) {
        queryClient.setQueryData<TData>(queryKey, context.previousData);
      }

      // Call custom onError if provided
      if (onError) {
        onError(error, variables, context);
      }
    },
    onSettled: (data, error, variables, context) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey });

      // Call custom onSettled if provided
      if (onSettled) {
        onSettled(data, error, variables, context);
      }
    },
  });
}
