import { useApiQuery, useApiMutation } from '@/shared/lib/api-hooks';
import { QueryKeys } from '@/shared/lib/query-keys';
import { queryClient } from '@/shared/lib/query-client';
import type { User } from '@/types';
import api from '@/shared/lib/api-client';

export interface UserData {
  name?: string;
  email?: string;
  role?: string;
  password?: string;
}

// Legacy API object for backward compatibility
export const usersAPI = {
  getUsers: () => api.get('/users'),
  createUser: (user: UserData) => api.post('/users', user),
  updateUser: (userId: string, user: UserData) =>
    api.put(`/users/${userId}`, user),
  deleteUser: (userId: string) => api.delete(`/users/${userId}`),
  getUser: (userId: string) => api.get(`/users/${userId}`),
};

// New React Query hooks
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
  return useApiMutation<{ user: User }, { id: string; data: UserData }>({
    url: (vars) => `/users/${vars.id}`,
    method: 'PUT',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.users.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.users.lists() });
    },
  });
}

export function useDeleteUser() {
  return useApiMutation<void, string>({
    url: (id) => `/users/${id}`,
    method: 'DELETE',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.users.lists() });
    },
  });
}
