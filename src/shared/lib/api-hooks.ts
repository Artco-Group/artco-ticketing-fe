import { useQuery, useMutation } from '@tanstack/react-query';
import type {
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { apiClient } from './api-client';
import type { AxiosRequestConfig } from 'axios';

interface ApiQueryOptions<TData> extends Omit<
  UseQueryOptions<TData>,
  'queryKey' | 'queryFn'
> {
  url: string;
  params?: Record<string, unknown>;
  config?: AxiosRequestConfig;
}

export function useApiQuery<TData>(
  queryKey: readonly unknown[],
  options: ApiQueryOptions<TData>
) {
  const { url, params, config, ...queryOptions } = options;

  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await apiClient.get<TData>(url, { params, ...config });
      return response.data;
    },
    ...queryOptions,
  });
}

interface ApiMutationOptions<TData, TVariables> extends Omit<
  UseMutationOptions<TData, Error, TVariables>,
  'mutationFn'
> {
  url: string | ((variables: TVariables) => string);
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  config?: AxiosRequestConfig;
}

export function useApiMutation<TData, TVariables = void>(
  options: ApiMutationOptions<TData, TVariables>
) {
  const { url, method = 'POST', config, ...mutationOptions } = options;

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const resolvedUrl = typeof url === 'function' ? url(variables) : url;
      const response = await apiClient.request<TData>({
        url: resolvedUrl,
        method,
        data: variables,
        ...config,
      });
      return response.data;
    },
    ...mutationOptions,
  });
}
