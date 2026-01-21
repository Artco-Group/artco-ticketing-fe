import { useEffect, type ReactNode } from 'react';
import { useCurrentUser, useLogout } from '../api';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: userData, isLoading, error } = useCurrentUser();
  const logoutMutation = useLogout();

  // Backend returns ApiResponse format: { status, data: { user } }
  const user = (userData as any)?.data?.user ?? null;
  // Only consider authenticated if we have user data and no error
  // If error is 401, we're not authenticated
  const isAuthenticated =
    !!user && (!error || (error as any)?.response?.status !== 401);

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
