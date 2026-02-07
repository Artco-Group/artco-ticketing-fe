import { useApiQuery, useApiMutation } from '@/shared/lib/api-hooks';
import {
  QueryKeys,
  API_ROUTES,
  CACHE,
  type Comment,
  type CreateCommentFormData,
} from '@artco-group/artco-ticketing-sync';
import { queryClient } from '@/shared/lib/query-client';
import type { TicketId, CommentId, ApiResponse } from '@/types';

/**
 * Get comments for a ticket
 */
function useComments(ticketId: TicketId) {
  return useApiQuery<ApiResponse<{ comments: Comment[] }>>(
    QueryKeys.comments.byTicket(ticketId),
    {
      url: API_ROUTES.COMMENTS.BY_TICKET(ticketId),
      enabled: !!ticketId,
      staleTime: CACHE.SHORT_STALE_TIME,
    }
  );
}

/**
 * Add a comment to a ticket
 */
function useAddComment() {
  return useApiMutation<
    ApiResponse<{ comment: Comment }>,
    { ticketId: TicketId; replyId?: string } & CreateCommentFormData
  >({
    url: (vars) => API_ROUTES.COMMENTS.BY_TICKET(vars.ticketId),
    method: 'POST',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.comments.byTicket(variables.ticketId),
      });
    },
  });
}

/**
 * Update an existing comment
 */
function useUpdateComment() {
  return useApiMutation<
    ApiResponse<{ comment: Comment }>,
    { commentId: CommentId } & CreateCommentFormData
  >({
    url: (vars) => API_ROUTES.COMMENTS.BY_ID(vars.commentId),
    method: 'PUT',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.comments.all() });
    },
  });
}

/**
 * Delete a comment
 */
function useDeleteComment() {
  return useApiMutation<void, CommentId>({
    url: (commentId) => API_ROUTES.COMMENTS.BY_ID(commentId),
    method: 'DELETE',
    getBody: () => undefined,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.comments.all() });
    },
  });
}

export { useComments, useAddComment, useUpdateComment, useDeleteComment };
