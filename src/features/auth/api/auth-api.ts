import { useQuery } from '@tanstack/react-query';
import { useApiQuery, useApiMutation } from '@/shared/lib/api-hooks';
import {
  QueryKeys,
  API_ROUTES,
} from '@artco-group/artco-ticketing-sync/constants';
import { queryClient } from '@/shared/lib/query-client';
import { apiClient } from '@/shared/lib/api-client';
import type {
  LoginFormData,
  LoginResponse,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  MessageResponse,
  CurrentUserResponse,
} from '@artco-group/artco-ticketing-sync/types';

export function useCurrentUser() {
  return useApiQuery<CurrentUserResponse>(QueryKeys.auth.currentUser(), {
    url: API_ROUTES.AUTH.ME,
    retry: false,
    staleTime: 0, // Always consider stale to allow refetch after login
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Refetch on mount to get fresh auth state after login
    refetchOnReconnect: false,
    throwOnError: false, // Don't throw on 401, it's expected when not logged in
  });
}

export function useLogin() {
  // Backend returns ApiResponse format: { status: 'success', data: { user }, message }
  return useApiMutation<
    { status: string; data: { user: LoginResponse['user'] }; message: string },
    LoginFormData
  >({
    url: API_ROUTES.AUTH.LOGIN,
    method: 'POST',
    onSuccess: async (response) => {
      // Set the current user data directly from login response
      // Must match the format returned by /auth/me: { status, data: { user } }
      const user = response?.data?.user;
      if (user) {
        queryClient.setQueryData(QueryKeys.auth.currentUser(), {
          status: 'success',
          data: { user },
        });
      }

      // Invalidate tickets query to refetch after login
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.lists(),
      });
    },
  });
}

export function useLogout() {
  return useApiMutation<void>({
    url: API_ROUTES.AUTH.LOGOUT,
    method: 'POST',
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useForgotPassword() {
  return useApiMutation<MessageResponse, ForgotPasswordFormData>({
    url: API_ROUTES.AUTH.FORGOT_PASSWORD,
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
      }>(API_ROUTES.AUTH.VERIFY_RESET_TOKEN(token));
      return response.data;
    },
    enabled: !!token,
    retry: false,
  });
}

export function useResetPassword() {
  return useApiMutation<MessageResponse, ResetPasswordFormData>({
    url: API_ROUTES.AUTH.RESET_PASSWORD,
    method: 'POST',
  });
}
