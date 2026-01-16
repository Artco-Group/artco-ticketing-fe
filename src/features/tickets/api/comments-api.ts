import { useApiQuery, useApiMutation } from '@/shared/lib/api-hooks';
import { QueryKeys } from '@/shared/lib/query-keys';
import { queryClient } from '@/shared/lib/query-client';
import type { Comment } from '@/types';
import api from '@/shared/lib/api-client';

interface CommentData {
  text: string;
}

// Legacy API object for backward compatibility
export const commentAPI = {
  addComment: (ticketId: string, comment: CommentData) =>
    api.post(`/comments/${ticketId}`, comment),
  getComments: (ticketId: string) => api.get(`/comments/${ticketId}`),
  deleteComment: (commentId: string) => api.delete(`/comments/${commentId}`),
  updateComment: (commentId: string, comment: CommentData) =>
    api.put(`/comments/${commentId}`, comment),
};

// New React Query hooks
export function useComments(ticketId: string) {
  return useApiQuery<{ comments: Comment[] }>(
    QueryKeys.comments.byTicket(ticketId),
    {
      url: `/comments/${ticketId}`,
      enabled: !!ticketId,
    }
  );
}

export function useAddComment() {
  return useApiMutation<
    { comment: Comment },
    { ticketId: string; comment: CommentData }
  >({
    url: (vars) => `/comments/${vars.ticketId}`,
    method: 'POST',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.comments.byTicket(variables.ticketId),
      });
    },
  });
}

export function useUpdateComment() {
  return useApiMutation<
    { comment: Comment },
    { commentId: string; comment: CommentData }
  >({
    url: (vars) => `/comments/${vars.commentId}`,
    method: 'PUT',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.comments.all() });
    },
  });
}

export function useDeleteComment() {
  return useApiMutation<void, string>({
    url: (commentId) => `/comments/${commentId}`,
    method: 'DELETE',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.comments.all() });
    },
  });
}
