import type { ReactNode } from 'react';
import { createContext, useState, useContext, useEffect } from 'react';
import type { User } from '@/interfaces';
import { authAPI } from '../services/authApi';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ user: User }>;
  register: (email: string, password: string) => Promise<{ user: User }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    authAPI
      .getCurrentUser()
      .then((response) => setUser(response.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (email: string, password: string) => {
    const response = await authAPI.register(email, password);
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
