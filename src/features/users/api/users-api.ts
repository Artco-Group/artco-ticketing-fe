import { useApiQuery, useApiMutation } from '@/shared/lib/api-hooks';
import {
  QueryKeys,
  API_ROUTES,
} from '@artco-group/artco-ticketing-sync/constants';
import { queryClient } from '@/shared/lib/query-client';
import type {
  User,
  CreateUserFormData,
  UpdateUserFormData,
} from '@artco-group/artco-ticketing-sync/types';
import api from '@/shared/lib/api-client';

// Legacy API object for backward compatibility
export const usersAPI = {
  getUsers: () => api.get(API_ROUTES.USERS.BASE),
  createUser: (user: CreateUserFormData) =>
    api.post(API_ROUTES.USERS.BASE, user),
  updateUser: (userId: string, user: UpdateUserFormData) =>
    api.put(API_ROUTES.USERS.BY_ID(userId), user),
  deleteUser: (userId: string) => api.delete(API_ROUTES.USERS.BY_ID(userId)),
  getUser: (userId: string) => api.get(API_ROUTES.USERS.BY_ID(userId)),
  getDevelopers: () => api.get(API_ROUTES.USERS.DEVELOPERS),
};

// New React Query hooks
export function useUsers(params?: Record<string, unknown>) {
  return useApiQuery<{ users: User[] }>(QueryKeys.users.list(params), {
    url: API_ROUTES.USERS.BASE,
    params,
  });
}

export function useUser(id: string) {
  return useApiQuery<{ user: User }>(QueryKeys.users.detail(id), {
    url: API_ROUTES.USERS.BY_ID(id),
    enabled: !!id,
  });
}

export function useDevelopers() {
  return useApiQuery<{ users: User[] }>(QueryKeys.users.developers(), {
    url: API_ROUTES.USERS.DEVELOPERS,
  });
}

export function useCreateUser() {
  return useApiMutation<{ user: User }, CreateUserFormData>({
    url: API_ROUTES.USERS.BASE,
    method: 'POST',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.users.lists() });
    },
  });
}

export function useUpdateUser() {
  return useApiMutation<
    { user: User },
    { id: string; data: UpdateUserFormData }
  >({
    url: (vars) => API_ROUTES.USERS.BY_ID(vars.id),
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
    url: (id) => API_ROUTES.USERS.BY_ID(id),
    method: 'DELETE',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.users.lists() });
    },
  });
}
