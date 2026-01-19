import { useEffect, type ReactNode } from 'react';
import { useCurrentUser, useLogout } from '../api';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: userData, isLoading, error } = useCurrentUser();
  const logoutMutation = useLogout();

  const user = userData?.user ?? null;
  const isAuthenticated = !!user && !error;

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
