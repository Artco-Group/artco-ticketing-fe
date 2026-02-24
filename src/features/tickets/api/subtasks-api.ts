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
import type { TicketId } from '@/types';

type SubtaskId = string;

interface SubtasksResponse {
  subtasks: Subtask[];
  progress: SubtaskProgress;
}

function useSubtasks(ticketId: TicketId) {
  return useApiQuery<SubtasksResponse>(QueryKeys.subtasks.byTicket(ticketId), {
    url: API_ROUTES.SUBTASKS.BY_TICKET(ticketId),
    enabled: !!ticketId,
    staleTime: CACHE.SHORT_STALE_TIME,
  });
}

function useCreateSubtask() {
  return useApiMutation<
    { subtask: Subtask },
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
    { subtask: Subtask },
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
    { subtask: Subtask },
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

interface ReorderContext {
  previousData: SubtasksResponse | undefined;
  queryKey: ReturnType<typeof QueryKeys.subtasks.byTicket>;
}

function useReorderSubtasks() {
  return useApiMutation<
    { subtasks: Subtask[] },
    { ticketId: TicketId; subtaskIds: string[] },
    ReorderContext
  >({
    url: (vars) => API_ROUTES.SUBTASKS.REORDER(vars.ticketId),
    method: 'PATCH',
    onMutate: async (variables) => {
      const queryKey = QueryKeys.subtasks.byTicket(variables.ticketId);

      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<SubtasksResponse>(queryKey);

      if (previousData?.subtasks) {
        const reorderedSubtasks = variables.subtaskIds
          .map((id) => previousData.subtasks.find((s: Subtask) => s.id === id))
          .filter(Boolean) as Subtask[];

        queryClient.setQueryData<SubtasksResponse>(queryKey, {
          ...previousData,
          subtasks: reorderedSubtasks,
        });
      }

      return { previousData, queryKey };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
    },
    onSettled: (_, __, variables) => {
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
  useReorderSubtasks,
};
