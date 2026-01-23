import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import {
  HttpStatus,
  TIMEOUTS,
  CONTENT_TYPES,
} from '@artco-group/artco-ticketing-sync';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: TIMEOUTS.API_REQUEST,
  headers: {
    'Content-Type': CONTENT_TYPES.JSON,
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add request timestamp for performance tracking
    config.metadata = { startTime: Date.now() };
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle session expiration - only dispatch once per request
    // Exclude /auth/me (prevents loop) and /auth/login (401 is expected for wrong credentials)
    const url = error.config?.url;
    const isAuthEndpoint = url === '/auth/me' || url === '/auth/login';
    if (error.response?.status === HttpStatus.UNAUTHORIZED && !isAuthEndpoint) {
      window.dispatchEvent(new CustomEvent('session-expired'));
    }
    return Promise.reject(error);
  }
);

// Default export for backward compatibility
export default apiClient;
