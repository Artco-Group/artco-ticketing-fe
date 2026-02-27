import { useApiQuery, useApiMutation } from '@/shared/lib/api-hooks';
import {
  QueryKeys,
  API_ROUTES,
  CACHE,
  type User,
  type UserQueryParams,
  type CreateUserFormData,
  type UpdateUserFormData,
} from '@artco-group/artco-ticketing-sync';
import { queryClient } from '@/shared/lib/query-client';
import type { UserId } from '@/types';

function useUsers(params?: UserQueryParams) {
  return useApiQuery<{ users: User[] }>(QueryKeys.users.list(params), {
    url: API_ROUTES.USERS.BASE,
    params,
    staleTime: CACHE.SHORT_STALE_TIME,
  });
}

function useUser(id: UserId) {
  return useApiQuery<{ user: User }>(QueryKeys.users.detail(id), {
    url: API_ROUTES.USERS.BY_ID(id),
    enabled: !!id,
    staleTime: CACHE.STALE_TIME,
  });
}

function useDevelopers() {
  return useApiQuery<{ users: User[] }>(QueryKeys.users.developers(), {
    url: API_ROUTES.USERS.DEVELOPERS,
    staleTime: CACHE.STALE_TIME,
  });
}

function useCreateUser() {
  return useApiMutation<{ user: User }, CreateUserFormData>({
    url: API_ROUTES.USERS.BASE,
    method: 'POST',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.users.lists() });
    },
  });
}

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
      queryClient.invalidateQueries({ queryKey: QueryKeys.auth.currentUser() });
    },
  });
}

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
  failedEmails: string[];
  errors: Record<string, string>;
}

function useBulkDeleteUsers() {
  return useApiMutation<BulkDeleteResult, { emails: string[] }>({
    url: API_ROUTES.USERS.BASE,
    method: 'DELETE',
    getBody: (vars) => vars,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.users.lists() });
    },
  });
}

function useUploadAvatar() {
  return useApiMutation<{ user: User }, { userId: UserId; file: File }>({
    url: (vars) => API_ROUTES.USERS.AVATAR(vars.userId),
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
      queryClient.invalidateQueries({ queryKey: QueryKeys.auth.currentUser() });
      // Invalidate projects since client avatars are embedded in project data
      queryClient.invalidateQueries({ queryKey: QueryKeys.projects.lists() });
    },
  });
}

function useRemoveAvatar() {
  return useApiMutation<{ user: User }, UserId>({
    url: (userId) => API_ROUTES.USERS.AVATAR(userId),
    method: 'DELETE',
    getBody: () => undefined,
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.users.detail(userId),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.users.lists() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.auth.currentUser() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.projects.lists() });
    },
  });
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
};
