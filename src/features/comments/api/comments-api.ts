import { useApiQuery, useApiMutation } from '../../../shared/lib/api-hooks';
import { QueryKeys } from '../../../shared/lib/query-keys';
import { queryClient } from '../../../shared/lib/query-client';
import type { Comment } from '../../../interfaces/ticket/Comment';

interface CommentData {
  text: string;
}

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
    url: (variables) => `/comments/${variables.ticketId}`,
    method: 'POST',
    getData: (variables) => variables.comment,
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
    url: (variables) => `/comments/${variables.commentId}`,
    method: 'PUT',
    getData: (variables) => variables.comment,
    onSuccess: () => {
      // Invalidate comments for the ticket - we need ticketId from the comment
      // For now, invalidate all comments queries
      queryClient.invalidateQueries({ queryKey: QueryKeys.comments.all() });
    },
  });
}

export function useDeleteComment() {
  return useApiMutation<void, string>({
    url: (commentId) => `/comments/${commentId}`,
    method: 'DELETE',
    onSuccess: () => {
      // Invalidate all comments queries since we don't have ticketId here
      queryClient.invalidateQueries({ queryKey: QueryKeys.comments.all() });
    },
  });
}
