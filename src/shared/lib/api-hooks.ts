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
  getData?: (variables: TVariables) => unknown;
}

export function useApiMutation<TData, TVariables = void>(
  options: ApiMutationOptions<TData, TVariables>
) {
  const { url, method = 'POST', config, getData, ...mutationOptions } = options;

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const resolvedUrl = typeof url === 'function' ? url(variables) : url;
      const requestData = getData ? getData(variables) : variables;
      const response = await apiClient.request<TData>({
        url: resolvedUrl,
        method,
        data: requestData,
        ...config,
      });
      return response.data;
    },
    ...mutationOptions,
  });
}
