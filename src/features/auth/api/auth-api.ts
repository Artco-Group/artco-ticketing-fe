import { useApiQuery, useApiMutation } from '../../../shared/lib/api-hooks';
import { QueryKeys } from '../../../shared/lib/query-keys';
import { queryClient } from '../../../shared/lib/query-client';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'developer' | 'eng_lead';
}

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

export function useRegister() {
  return useApiMutation<LoginResponse, { email: string; password: string }>({
    url: '/auth/register',
    method: 'POST',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.auth.currentUser() });
    },
  });
}

export function useForgotPassword() {
  return useApiMutation<{ message: string }, { email: string }>({
    url: '/auth/forgot-password',
    method: 'POST',
  });
}

export function useVerifyResetToken(token: string) {
  return useApiQuery<{ valid: boolean }>(
    ['auth', 'verify-reset-token', token],
    {
      url: `/auth/verify-reset-token/${token}`,
      enabled: !!token,
      retry: false,
    }
  );
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
