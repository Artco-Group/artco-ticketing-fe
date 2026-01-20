import { createContext } from 'react';
import type { User } from '@artco-group/artco-ticketing-sync/types';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
