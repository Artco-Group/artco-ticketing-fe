import api from './axiosConfig';

export const usersAPI = {
  getUsers: () => api.get('/users'),
  createUser: (user) => api.post('/users', user),
  updateUser: (userId, user) => api.put(`/users/${userId}`, user),
  deleteUser: (userId) => api.delete(`/users/${userId}`),
  getUser: (userId) => api.get(`/users/${userId}`),
};
