import api from '@/shared/lib/api-client';

export interface UserData {
  name?: string;
  email?: string;
  role?: string;
  password?: string;
}

export const usersAPI = {
  getUsers: () => api.get('/users'),
  createUser: (user: UserData) => api.post('/users', user),
  updateUser: (userId: string, user: UserData) =>
    api.put(`/users/${userId}`, user),
  deleteUser: (userId: string) => api.delete(`/users/${userId}`),
  getUser: (userId: string) => api.get(`/users/${userId}`),
};
