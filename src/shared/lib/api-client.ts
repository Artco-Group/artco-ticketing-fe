import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import {
  HttpStatus,
  TIMEOUTS,
  CONTENT_TYPES,
} from '@artco-group/artco-ticketing-sync';
import { toast } from '@/shared/components/ui/Toast';

export const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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

// Response interceptor with centralized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isAuthEndpoint =
      url === '/auth/me' ||
      url === '/auth/login' ||
      url.includes('verify-reset-token') ||
      url.includes('reset-password');

    if (!error.response) {
      toast.error('Network error. Check your connection.');
      return Promise.reject(error);
    }

    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        // Handle session expiration - exclude auth endpoints to prevent loops
        if (!isAuthEndpoint) {
          window.dispatchEvent(new CustomEvent('session-expired'));
          window.location.href = '/login';
        }
        break;

      case HttpStatus.FORBIDDEN:
        toast.error('You do not have permission for this action.');
        break;

      case HttpStatus.TOO_MANY_REQUESTS:
        toast.error('Too many requests. Please wait a moment.');
        break;

      case HttpStatus.INTERNAL_SERVER_ERROR:
        toast.error('Server error. Please try again later.');
        break;

      default:
        break;
    }

    return Promise.reject(error);
  }
);

export default apiClient;
