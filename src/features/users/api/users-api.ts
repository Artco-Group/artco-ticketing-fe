import { useApiQuery, useApiMutation } from '@/shared/lib/api-hooks';
import {
  QueryKeys,
  API_ROUTES,
  CACHE,
  type User,
  type CreateUserFormData,
  type UpdateUserFormData,
} from '@artco-group/artco-ticketing-sync';
import { queryClient } from '@/shared/lib/query-client';
import type { UserId } from '@/types';

/** API response wrapper type */
interface ApiResponse<T> {
  status: string;
  data: T;
}

/**
 * Get all users
 */
function useUsers(params?: Record<string, unknown>) {
  return useApiQuery<ApiResponse<{ users: User[] }>>(
    QueryKeys.users.list(params),
    {
      url: API_ROUTES.USERS.BASE,
      params,
      staleTime: CACHE.SHORT_STALE_TIME,
    }
  );
}

/**
 * Get a single user by ID
 */
function useUser(id: UserId) {
  return useApiQuery<{ user: User }>(QueryKeys.users.detail(id), {
    url: API_ROUTES.USERS.BY_ID(id),
    enabled: !!id,
    staleTime: CACHE.STALE_TIME,
  });
}

/**
 * Get all developers
 */
function useDevelopers() {
  return useApiQuery<ApiResponse<{ users: User[] }>>(
    QueryKeys.users.developers(),
    {
      url: API_ROUTES.USERS.DEVELOPERS,
      staleTime: CACHE.STALE_TIME,
    }
  );
}

/**
 * Create a new user
 */
function useCreateUser() {
  return useApiMutation<{ user: User }, CreateUserFormData>({
    url: API_ROUTES.USERS.BASE,
    method: 'POST',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.users.lists() });
    },
  });
}

/**
 * Update an existing user
 */
function useUpdateUser() {
  return useApiMutation<
    { user: User },
    { id: UserId; data: UpdateUserFormData }
  >({
    url: (vars) => API_ROUTES.USERS.BY_ID(vars.id),
    method: 'PUT',
    getBody: (vars) => vars.data,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.users.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.users.lists() });
    },
  });
}

/**
 * Delete a user
 */
function useDeleteUser() {
  return useApiMutation<void, UserId>({
    url: (id) => API_ROUTES.USERS.BY_ID(id),
    method: 'DELETE',
    getBody: () => undefined,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.users.lists() });
    },
  });
}

/**
 * Namespaced API export (FMROI pattern)
 */
export const usersApi = {
  useUsers,
  useUser,
  useDevelopers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  keys: QueryKeys.users,
};

// Individual exports for backwards compatibility
export {
  useUsers,
  useUser,
  useDevelopers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
};
