import { useEffect, type ReactNode } from 'react';
import type { ApiResponse, AuthUser } from '@artco-group/artco-ticketing-sync';
import type { AxiosError } from 'axios';
import { useCurrentUser, useLogout } from '../api';
import { AuthContext } from './auth-context';

type CurrentUserApiResponse = ApiResponse<{ user: AuthUser }>;

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: userData, isLoading, error } = useCurrentUser();
  const logoutMutation = useLogout();

  const apiResponse = userData as unknown as CurrentUserApiResponse | null;
  const user = apiResponse?.data?.user ?? null;
  const axiosError = error as AxiosError | null;
  const isAuthenticated =
    !!user && (!error || axiosError?.response?.status !== 401);

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
