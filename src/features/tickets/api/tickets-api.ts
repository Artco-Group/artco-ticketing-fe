import { useApiQuery, useApiMutation } from '@/shared/lib/api-hooks';
import {
  QueryKeys,
  API_ROUTES,
  CACHE,
  type Ticket,
  type TicketInput,
  type TicketQueryParams,
  type ApiResponse,
} from '@artco-group/artco-ticketing-sync';
import { queryClient } from '@/shared/lib/query-client';
import type { TicketId, UserId } from '@/types';

function useTickets(params?: TicketQueryParams) {
  return useApiQuery<Ticket[] | { tickets: Ticket[] }>(
    QueryKeys.tickets.list(params),
    {
      url: API_ROUTES.TICKETS.BASE,
      params,
      staleTime: CACHE.SHORT_STALE_TIME,
    }
  );
}

function useTicket(id: TicketId) {
  return useApiQuery<{ ticket: Ticket }>(QueryKeys.tickets.detail(id), {
    url: API_ROUTES.TICKETS.BY_TICKET_ID(id),
    enabled: !!id,
    staleTime: CACHE.STALE_TIME,
  });
}

function useCreateTicket() {
  return useApiMutation<ApiResponse<{ ticket: Ticket }>, FormData>({
    url: API_ROUTES.TICKETS.BASE,
    method: 'POST',
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.all(),
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: QueryKeys.projects.all(),
        exact: false,
      });
    },
  });
}

interface OptimisticContext {
  previous?: { ticket: Ticket };
}

function useUpdateTicketStatus() {
  return useApiMutation<
    { ticket: Ticket },
    { id: TicketId; status: string },
    OptimisticContext
  >({
    url: (vars) => API_ROUTES.TICKETS.STATUS(vars.id),
    method: 'PATCH',
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: QueryKeys.tickets.detail(variables.id),
      });
      const previous = queryClient.getQueryData<{ ticket: Ticket }>(
        QueryKeys.tickets.detail(variables.id)
      );
      if (previous?.ticket) {
        queryClient.setQueryData(QueryKeys.tickets.detail(variables.id), {
          ticket: { ...previous.ticket, status: variables.status },
        });
      }
      return { previous };
    },
    onError: (_, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          QueryKeys.tickets.detail(variables.id),
          context.previous
        );
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.projects.all() });
    },
  });
}

function useAssignTicket() {
  return useApiMutation<
    { ticket: Ticket },
    { id: TicketId; developerId: UserId },
    OptimisticContext
  >({
    url: (vars) => API_ROUTES.TICKETS.ASSIGN(vars.id),
    method: 'PATCH',
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: QueryKeys.tickets.detail(variables.id),
      });
      const previous = queryClient.getQueryData<{ ticket: Ticket }>(
        QueryKeys.tickets.detail(variables.id)
      );
      if (previous?.ticket) {
        queryClient.setQueryData(QueryKeys.tickets.detail(variables.id), {
          ticket: {
            ...previous.ticket,
            assignedTo: { id: variables.developerId } as Ticket['assignedTo'],
          },
        });
      }
      return { previous };
    },
    onError: (_, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          QueryKeys.tickets.detail(variables.id),
          context.previous
        );
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
    },
  });
}

function useAssignEngLead() {
  return useApiMutation<
    ApiResponse<{ ticket: Ticket }>,
    { id: TicketId; engLeadId: UserId },
    OptimisticContext
  >({
    url: (vars) => API_ROUTES.TICKETS.ENG_LEAD(vars.id),
    method: 'PATCH',
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: QueryKeys.tickets.detail(variables.id),
      });
      const previous = queryClient.getQueryData<{ ticket: Ticket }>(
        QueryKeys.tickets.detail(variables.id)
      );
      if (previous?.ticket) {
        queryClient.setQueryData(QueryKeys.tickets.detail(variables.id), {
          ticket: {
            ...previous.ticket,
            engLead: { id: variables.engLeadId } as Ticket['engLead'],
          },
        });
      }
      return { previous };
    },
    onError: (_, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          QueryKeys.tickets.detail(variables.id),
          context.previous
        );
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
    },
  });
}

function useUpdateTicketPriority() {
  return useApiMutation<
    { ticket: Ticket },
    { id: TicketId; priority: string },
    OptimisticContext
  >({
    url: (vars) => API_ROUTES.TICKETS.PRIORITY(vars.id),
    method: 'PATCH',
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: QueryKeys.tickets.detail(variables.id),
      });
      const previous = queryClient.getQueryData<{ ticket: Ticket }>(
        QueryKeys.tickets.detail(variables.id)
      );
      if (previous?.ticket) {
        queryClient.setQueryData(QueryKeys.tickets.detail(variables.id), {
          ticket: { ...previous.ticket, priority: variables.priority },
        });
      }
      return { previous };
    },
    onError: (_, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          QueryKeys.tickets.detail(variables.id),
          context.previous
        );
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
    },
  });
}

function useUpdateTicket() {
  return useApiMutation<
    ApiResponse<{ ticket: Ticket }>,
    { id: TicketId; data: Partial<TicketInput> },
    OptimisticContext
  >({
    url: (vars) => API_ROUTES.TICKETS.BY_TICKET_ID(vars.id),
    method: 'PUT',
    getBody: (vars) => vars.data,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: QueryKeys.tickets.detail(variables.id),
      });
      const previous = queryClient.getQueryData<{ ticket: Ticket }>(
        QueryKeys.tickets.detail(variables.id)
      );
      if (previous?.ticket) {
        const { project: _project, ...optimisticFields } = variables.data;
        queryClient.setQueryData(QueryKeys.tickets.detail(variables.id), {
          ticket: { ...previous.ticket, ...optimisticFields },
        });
      }
      return { previous };
    },
    onError: (_, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          QueryKeys.tickets.detail(variables.id),
          context.previous
        );
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
    },
  });
}

function useDeleteTicket() {
  return useApiMutation<void, TicketId>({
    url: (id) => API_ROUTES.TICKETS.BY_TICKET_ID(id),
    method: 'DELETE',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.projects.all() });
    },
  });
}

interface BulkDeleteResult {
  deletedCount: number;
  failedIds: string[];
}

interface BulkUpdatePriorityResult {
  updatedCount: number;
  failedIds: string[];
}

function useBulkDeleteTickets() {
  return useApiMutation<ApiResponse<BulkDeleteResult>, { ticketIds: string[] }>(
    {
      url: API_ROUTES.TICKETS.BASE,
      method: 'DELETE',
      getBody: (vars) => vars,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
        queryClient.invalidateQueries({ queryKey: QueryKeys.projects.all() });
      },
    }
  );
}

function useBulkUpdatePriority() {
  return useApiMutation<
    ApiResponse<BulkUpdatePriorityResult>,
    { ids: string[]; priority: string }
  >({
    url: API_ROUTES.TICKETS.BULK_PRIORITY,
    method: 'PATCH',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.projects.all() });
    },
  });
}

function useUploadScreenRecording() {
  return useApiMutation<
    ApiResponse<{ ticket: Ticket }>,
    { ticketId: TicketId; formData: FormData }
  >({
    url: (vars) => API_ROUTES.TICKETS.SCREEN_RECORDING(vars.ticketId),
    method: 'POST',
    getBody: (vars) => vars.formData,
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.detail(variables.ticketId),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
    },
  });
}

function useUploadAttachments() {
  return useApiMutation<
    ApiResponse<{ ticket: Ticket }>,
    { ticketId: TicketId; formData: FormData }
  >({
    url: (vars) => API_ROUTES.TICKETS.ATTACHMENTS(vars.ticketId),
    method: 'POST',
    getBody: (vars) => vars.formData,
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.detail(variables.ticketId),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
    },
  });
}

function useDeleteAttachment() {
  return useApiMutation<
    ApiResponse<{ ticket: Ticket }>,
    { ticketId: TicketId; attachmentIndex: number }
  >({
    url: (vars) =>
      API_ROUTES.TICKETS.ATTACHMENT(vars.ticketId, vars.attachmentIndex),
    method: 'DELETE',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.detail(variables.ticketId),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
    },
  });
}

function useDeleteScreenRecording() {
  return useApiMutation<
    ApiResponse<{ ticket: Ticket }>,
    { ticketId: TicketId; recordingIndex: number }
  >({
    url: (vars) =>
      API_ROUTES.TICKETS.SCREEN_RECORDING_BY_INDEX(
        vars.ticketId,
        vars.recordingIndex
      ),
    method: 'DELETE',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.detail(variables.ticketId),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
    },
  });
}

export {
  useTickets,
  useTicket,
  useCreateTicket,
  useUpdateTicket,
  useUpdateTicketStatus,
  useAssignTicket,
  useAssignEngLead,
  useUpdateTicketPriority,
  useBulkUpdatePriority,
  useDeleteTicket,
  useBulkDeleteTickets,
  useUploadScreenRecording,
  useUploadAttachments,
  useDeleteAttachment,
  useDeleteScreenRecording,
};
