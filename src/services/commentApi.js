import api from './axiosConfig';

export const commentAPI = {
  addComment: (ticketId, comment) => api.post(`/comments/${ticketId}`, comment),

  getComments: (ticketId) => api.get(`/comments/${ticketId}`),

  deleteComment: (commentId) => api.delete(`/comments/${commentId}`),

  updateComment: (commentId, comment) =>
    api.put(`/comments/${commentId}`, comment),
};
