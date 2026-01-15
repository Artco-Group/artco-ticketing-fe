import { useApiQuery, useApiMutation } from '../../../shared/lib/api-hooks';
import { QueryKeys } from '../../../shared/lib/query-keys';
import { queryClient } from '../../../shared/lib/query-client';
import type { User } from '../../../interfaces/user/User';

export interface UserData {
  name?: string;
  email?: string;
  role?: string;
  password?: string;
}

export function useUsers(params?: Record<string, unknown>) {
  return useApiQuery<{ users: User[] }>(QueryKeys.users.list(params), {
    url: '/users',
    params,
  });
}

export function useUser(id: string) {
  return useApiQuery<{ user: User }>(QueryKeys.users.detail(id), {
    url: `/users/${id}`,
    enabled: !!id,
  });
}

export function useCreateUser() {
  return useApiMutation<{ user: User }, UserData>({
    url: '/users',
    method: 'POST',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.users.lists() });
    },
  });
}

export function useUpdateUser() {
  return useApiMutation<{ user: User }, { userId: string; user: UserData }>({
    url: (variables) => `/users/${variables.userId}`,
    method: 'PUT',
    getData: (variables) => variables.user,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.users.detail(variables.userId),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.users.lists() });
    },
  });
}

export function useDeleteUser() {
  return useApiMutation<void, string>({
    url: (userId) => `/users/${userId}`,
    method: 'DELETE',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.users.lists() });
    },
  });
}
