import { useApiQuery, useApiMutation } from '@/shared/lib/api-hooks';
import {
  QueryKeys,
  API_ROUTES,
} from '@artco-group/artco-ticketing-sync/constants';
import { queryClient } from '@/shared/lib/query-client';
import type {
  Comment,
  CreateCommentFormData,
} from '@artco-group/artco-ticketing-sync/types';
import api from '@/shared/lib/api-client';

export const commentAPI = {
  addComment: (ticketId: string, comment: CreateCommentFormData) =>
    api.post(API_ROUTES.COMMENTS.BY_TICKET(ticketId), comment),
  getComments: (ticketId: string) =>
    api.get(API_ROUTES.COMMENTS.BY_TICKET(ticketId)),
  deleteComment: (commentId: string) =>
    api.delete(API_ROUTES.COMMENTS.BY_ID(commentId)),
  updateComment: (commentId: string, comment: CreateCommentFormData) =>
    api.put(API_ROUTES.COMMENTS.BY_ID(commentId), comment),
};

// New React Query hooks
export function useComments(ticketId: string) {
  return useApiQuery<{ comments: Comment[] }>(
    QueryKeys.comments.byTicket(ticketId),
    {
      url: API_ROUTES.COMMENTS.BY_TICKET(ticketId),
      enabled: !!ticketId,
    }
  );
}

export function useAddComment() {
  return useApiMutation<
    { comment: Comment },
    { ticketId: string; comment: CreateCommentFormData }
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

export function useUpdateComment() {
  return useApiMutation<
    { comment: Comment },
    { commentId: string; comment: CreateCommentFormData }
  >({
    url: (vars) => API_ROUTES.COMMENTS.BY_ID(vars.commentId),
    method: 'PUT',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.comments.all() });
    },
  });
}

export function useDeleteComment() {
  return useApiMutation<void, string>({
    url: (commentId) => API_ROUTES.COMMENTS.BY_ID(commentId),
    method: 'DELETE',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.comments.all() });
    },
  });
}
