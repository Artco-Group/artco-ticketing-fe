import { useEffect, type ReactNode } from 'react';
import type { ApiResponse, AuthUser } from '@artco-group/artco-ticketing-sync';
import type { AxiosError } from 'axios';
import { useCurrentUser, useLogout } from '../api';
import { AuthContext } from './auth-context';

// Backend returns ApiResponse format: { status, data: { user } }
type CurrentUserApiResponse = ApiResponse<{ user: AuthUser }>;

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: userData, isLoading, error } = useCurrentUser();
  const logoutMutation = useLogout();

  // Extract user from the API response wrapper
  const apiResponse = userData as unknown as CurrentUserApiResponse | null;
  const user = apiResponse?.data?.user ?? null;
  // Only consider authenticated if we have user data and no error
  // If error is 401, we're not authenticated
  const axiosError = error as AxiosError | null;
  const isAuthenticated =
    !!user && (!error || axiosError?.response?.status !== 401);

  // Listen for session expiration events
  useEffect(() => {
    const handleSessionExpired = () => {
      logoutMutation.mutate();
    };

    window.addEventListener('session-expired', handleSessionExpired);
    return () =>
      window.removeEventListener('session-expired', handleSessionExpired);
  }, [logoutMutation]);

  const logout = () => {
    logoutMutation.mutate();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
