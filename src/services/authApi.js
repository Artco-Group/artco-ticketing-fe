import api from './axiosConfig';

export const authAPI = {
  register: (email, password) =>
    api.post('/auth/register', { email, password }),

  login: (email, password) => api.post('/auth/login', { email, password }),

  logout: () => api.post('/auth/logout'),

  getCurrentUser: () => api.get('/auth/me'),

  // Password Reset
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),

  verifyResetToken: (token) => api.get(`/auth/verify-reset-token/${token}`),

  resetPassword: (token, newPassword) =>
    api.post('/auth/reset-password', { token, newPassword }),
};
