import { useApiQuery, useApiMutation } from '@/shared/lib/api-hooks';
import {
  QueryKeys,
  API_ROUTES,
  CACHE,
  type Subtask,
  type SubtaskProgress,
  type CreateSubtaskFormData,
  type UpdateSubtaskFormData,
} from '@artco-group/artco-ticketing-sync';
import { queryClient } from '@/shared/lib/query-client';
import type { TicketId, ApiResponse } from '@/types';

type SubtaskId = string;

interface SubtasksResponse {
  subtasks: Subtask[];
  progress: SubtaskProgress;
}

function useSubtasks(ticketId: TicketId) {
  return useApiQuery<ApiResponse<SubtasksResponse>>(
    QueryKeys.subtasks.byTicket(ticketId),
    {
      url: API_ROUTES.SUBTASKS.BY_TICKET(ticketId),
      enabled: !!ticketId,
      staleTime: CACHE.SHORT_STALE_TIME,
    }
  );
}

function useCreateSubtask() {
  return useApiMutation<
    ApiResponse<{ subtask: Subtask }>,
    { ticketId: TicketId } & CreateSubtaskFormData
  >({
    url: (vars) => API_ROUTES.SUBTASKS.BY_TICKET(vars.ticketId),
    method: 'POST',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.subtasks.byTicket(variables.ticketId),
      });
    },
  });
}

function useUpdateSubtask() {
  return useApiMutation<
    ApiResponse<{ subtask: Subtask }>,
    { subtaskId: SubtaskId; ticketId: TicketId } & UpdateSubtaskFormData
  >({
    url: (vars) => API_ROUTES.SUBTASKS.BY_ID(vars.subtaskId),
    method: 'PUT',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.subtasks.byTicket(variables.ticketId),
      });
    },
  });
}

function useToggleSubtask() {
  return useApiMutation<
    ApiResponse<{ subtask: Subtask }>,
    { subtaskId: SubtaskId; ticketId: TicketId }
  >({
    url: (vars) => API_ROUTES.SUBTASKS.TOGGLE(vars.subtaskId),
    method: 'PATCH',
    getBody: () => undefined,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.subtasks.byTicket(variables.ticketId),
      });
    },
  });
}

function useDeleteSubtask() {
  return useApiMutation<void, { subtaskId: SubtaskId; ticketId: TicketId }>({
    url: (vars) => API_ROUTES.SUBTASKS.BY_ID(vars.subtaskId),
    method: 'DELETE',
    getBody: () => undefined,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.subtasks.byTicket(variables.ticketId),
      });
    },
  });
}

export {
  useSubtasks,
  useCreateSubtask,
  useUpdateSubtask,
  useToggleSubtask,
  useDeleteSubtask,
};
