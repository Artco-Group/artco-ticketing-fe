import { useQuery } from '@tanstack/react-query';
import { useApiQuery, useApiMutation } from '@/shared/lib/api-hooks';
import {
  QueryKeys,
  API_ROUTES,
  CACHE,
  type ApiResponse,
  type LoginFormData,
  type LoginResponse,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
  type MessageResponse,
  type CurrentUserResponse,
} from '@artco-group/artco-ticketing-sync';
import { apiClient } from '@/shared/lib/api-client';
import { queryClient } from '@/shared/lib/query-client';

/**
 * Get current authenticated user
 */
function useCurrentUser() {
  return useApiQuery<CurrentUserResponse>(QueryKeys.auth.currentUser(), {
    url: API_ROUTES.AUTH.ME,
    retry: false,
    staleTime: CACHE.AUTH_STALE_TIME,
    gcTime: CACHE.AUTH_GC_TIME,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    throwOnError: false,
  });
}

/**
 * Login with email and password
 */
function useLogin() {
  return useApiMutation<
    { status: string; data: { user: LoginResponse['user'] }; message: string },
    LoginFormData
  >({
    url: API_ROUTES.AUTH.LOGIN,
    method: 'POST',
    onSuccess: async (response) => {
      const user = response?.data?.user;
      if (user) {
        queryClient.setQueryData(QueryKeys.auth.currentUser(), {
          status: 'success',
          data: { user },
        });
      }
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.lists(),
      });
    },
  });
}

/**
 * Logout and clear session
 */
function useLogout() {
  return useApiMutation<void>({
    url: API_ROUTES.AUTH.LOGOUT,
    method: 'POST',
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

/**
 * Request password reset email
 */
function useForgotPassword() {
  return useApiMutation<MessageResponse, ForgotPasswordFormData>({
    url: API_ROUTES.AUTH.FORGOT_PASSWORD,
    method: 'POST',
  });
}

/**
 * Verify password reset token
 */
function useVerifyResetToken(token: string | undefined) {
  return useQuery<{ valid: boolean }>({
    queryKey: QueryKeys.auth.verifyResetToken(token || ''),
    queryFn: async () => {
      if (!token) throw new Error('Token is required');
      const response = await apiClient.get<ApiResponse<{ valid: boolean }>>(
        API_ROUTES.AUTH.VERIFY_RESET_TOKEN(token)
      );
      return response.data.data as { valid: boolean };
    },
    enabled: !!token,
    retry: false,
  });
}

/**
 * Reset password with token
 */
function useResetPassword() {
  return useApiMutation<MessageResponse, ResetPasswordFormData>({
    url: API_ROUTES.AUTH.RESET_PASSWORD,
    method: 'POST',
  });
}

/**
 * Namespaced API export (FMROI pattern)
 */
export const authApi = {
  useCurrentUser,
  useLogin,
  useLogout,
  useForgotPassword,
  useVerifyResetToken,
  useResetPassword,
  keys: QueryKeys.auth,
};

// Individual exports for backwards compatibility
export {
  useCurrentUser,
  useLogin,
  useLogout,
  useForgotPassword,
  useVerifyResetToken,
  useResetPassword,
};
