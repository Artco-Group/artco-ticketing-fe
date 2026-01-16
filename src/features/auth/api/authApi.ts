import api from '@/shared/lib/api-client';

export const authAPI = {
  register: (email: string, password: string) =>
    api.post('/auth/register', { email, password }),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  logout: () => api.post('/auth/logout'),

  getCurrentUser: () => api.get('/auth/me'),

  // Password Reset
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  verifyResetToken: (token: string) =>
    api.get(`/auth/verify-reset-token/${token}`),

  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword }),
};

export default authAPI;
