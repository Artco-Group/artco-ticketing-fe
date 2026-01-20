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

// Backend returns ApiResponse<{ user: User }> = { status: 'success', data: { user: ... } }
// But we want to work with { user: User } directly, so we transform it
export function useCurrentUser() {
  return useApiQuery<{ user: User }>(QueryKeys.auth.currentUser(), {
    url: '/auth/me',
    retry: false,
    staleTime: 0, // Always consider stale to allow refetch after login
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch on mount to get fresh auth state after login
    refetchOnReconnect: false,
    throwOnError: false, // Don't throw on 401, it's expected when not logged in
    // Transform response from ApiResponse<{ user: User }> to { user: User }
    select: (data: any) => {
      // If data is already { user: ... }, return it
      if (data?.user) return data;
      // If data is ApiResponse format { status: 'success', data: { user: ... } }, extract data
      if (data?.data?.user) return data.data;
      // Otherwise return null
      return null;
    },
  });
}

export function useLogin() {
  return useApiMutation<LoginResponse, LoginInput>({
    url: '/auth/login',
    method: 'POST',
    onSuccess: async () => {
      try {
        // Delay to ensure cookie is set in browser before refetching
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Invalidate and refetch current user query
        await queryClient.invalidateQueries({
          queryKey: QueryKeys.auth.currentUser(),
        });

        // Invalidate tickets query to refetch after login
        queryClient.invalidateQueries({
          queryKey: QueryKeys.tickets.lists(),
        });
      } catch (_error) {
        // Don't throw error in onSuccess - login was successful, just refetch failed
        // This is non-critical as the query will refetch on mount
      }
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
