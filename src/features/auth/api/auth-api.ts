import { useQuery } from '@tanstack/react-query';
import { useApiQuery, useApiMutation } from '@/shared/lib/api-hooks';
import { QueryKeys } from '@/shared/lib/query-keys';
import { queryClient } from '@/shared/lib/query-client';
import { apiClient } from '@/shared/lib/api-client';
import type { User } from '@/types';

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  message: string;
}

export function useCurrentUser() {
  return useApiQuery<{ user: User }>(QueryKeys.auth.currentUser(), {
    url: '/auth/me',
    retry: false,
    staleTime: Infinity,
  });
}

export function useLogin() {
  return useApiMutation<LoginResponse, LoginInput>({
    url: '/auth/login',
    method: 'POST',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.auth.currentUser() });
    },
  });
}

export function useLogout() {
  return useApiMutation<void>({
    url: '/auth/logout',
    method: 'POST',
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useForgotPassword() {
  return useApiMutation<{ message: string }, { email: string }>({
    url: '/auth/forgot-password',
    method: 'POST',
  });
}

export function useVerifyResetToken(token: string | undefined) {
  return useQuery<{ valid: boolean; message?: string }>({
    queryKey: QueryKeys.auth.verifyResetToken(token || ''),
    queryFn: async () => {
      if (!token) throw new Error('Token is required');
      const response = await apiClient.get<{
        valid: boolean;
        message?: string;
      }>(`/auth/verify-reset-token/${token}`);
      return response.data;
    },
    enabled: !!token,
    retry: false,
  });
}

export function useResetPassword() {
  return useApiMutation<
    { message: string },
    { token: string; newPassword: string }
  >({
    url: '/auth/reset-password',
    method: 'POST',
  });
}
