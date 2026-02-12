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
import { API_URL } from '@/shared/lib/api-client';
import type { UserId, ApiResponse } from '@/types';

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
  return useApiMutation<ApiResponse<{ user: User }>, CreateUserFormData>({
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

interface BulkDeleteResult {
  deletedCount: number;
  failedIds: string[];
  errors: Record<string, string>;
}

/**
 * Bulk delete users
 */
function useBulkDeleteUsers() {
  return useApiMutation<ApiResponse<BulkDeleteResult>, { ids: string[] }>({
    url: API_ROUTES.USERS.BASE,
    method: 'DELETE',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.users.lists() });
    },
  });
}

/**
 * Upload user avatar
 */
function useUploadAvatar() {
  return useApiMutation<
    ApiResponse<{ user: User }>,
    { userId: UserId; file: File }
  >({
    url: (vars) => `${API_ROUTES.USERS.BY_ID(vars.userId)}/avatar`,
    method: 'POST',
    getBody: (vars) => {
      const formData = new FormData();
      formData.append('avatar', vars.file);
      return formData;
    },
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.users.detail(variables.userId),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.users.lists() });
    },
  });
}

/**
 * Remove user avatar
 */
function useRemoveAvatar() {
  return useApiMutation<ApiResponse<{ user: User }>, UserId>({
    url: (userId) => `${API_ROUTES.USERS.BY_ID(userId)}/avatar`,
    method: 'DELETE',
    getBody: () => undefined,
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.users.detail(userId),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.users.lists() });
    },
  });
}

/**
 * Get avatar URL for a user
 */
function getAvatarUrl(userId: UserId): string {
  return `${API_URL}${API_ROUTES.USERS.BY_ID(userId)}/avatar`;
}

export {
  useUsers,
  useUser,
  useDevelopers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useBulkDeleteUsers,
  useUploadAvatar,
  useRemoveAvatar,
  getAvatarUrl,
};
