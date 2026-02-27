import { useApiQuery, useApiMutation } from '@/shared/lib/api-hooks';
import {
  QueryKeys,
  API_ROUTES,
  CACHE,
  type User,
  type CreateSubClientFormData,
  type UpdateSubClientFormData,
} from '@artco-group/artco-ticketing-sync';
import { queryClient } from '@/shared/lib/query-client';

export function useSubClients() {
  return useApiQuery<{ subClients: User[] }>(QueryKeys.subClients.list(), {
    url: API_ROUTES.SUB_CLIENTS.BASE,
    staleTime: CACHE.SHORT_STALE_TIME,
  });
}

export function useCreateSubClient() {
  return useApiMutation<{ user: User }, CreateSubClientFormData>({
    url: API_ROUTES.SUB_CLIENTS.BASE,
    method: 'POST',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.subClients.lists(),
      });
    },
  });
}

export function useUpdateSubClient() {
  return useApiMutation<
    { user: User },
    { id: string; data: UpdateSubClientFormData }
  >({
    url: (vars) => API_ROUTES.SUB_CLIENTS.BY_ID(vars.id),
    method: 'PUT',
    getBody: (vars) => vars.data,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.subClients.lists(),
      });
    },
  });
}

export function useDeleteSubClient() {
  return useApiMutation<void, string>({
    url: (id) => API_ROUTES.SUB_CLIENTS.BY_ID(id),
    method: 'DELETE',
    getBody: () => undefined,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.subClients.lists(),
      });
    },
  });
}
