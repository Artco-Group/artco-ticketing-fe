import api from '@/shared/lib/api-client';

interface CommentData {
  text: string;
}

export const commentAPI = {
  addComment: (ticketId: string, comment: CommentData) =>
    api.post(`/comments/${ticketId}`, comment),

  getComments: (ticketId: string) => api.get(`/comments/${ticketId}`),

  deleteComment: (commentId: string) => api.delete(`/comments/${commentId}`),

  updateComment: (commentId: string, comment: CommentData) =>
    api.put(`/comments/${commentId}`, comment),
};
