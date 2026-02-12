import { useApiQuery, useApiMutation } from '@/shared/lib/api-hooks';
import {
  QueryKeys,
  API_ROUTES,
  CACHE,
  type Ticket,
  type TicketInput,
} from '@artco-group/artco-ticketing-sync';
import { queryClient } from '@/shared/lib/query-client';
import type { TicketId, UserId, ApiResponse } from '@/types';

/**
 * Get all tickets
 * Uses SHORT_STALE_TIME for frequently changing list data
 */
function useTickets(params?: Record<string, unknown>) {
  return useApiQuery<Ticket[] | { tickets: Ticket[] }>(
    QueryKeys.tickets.list(params),
    {
      url: API_ROUTES.TICKETS.BASE,
      params,
      staleTime: CACHE.SHORT_STALE_TIME,
    }
  );
}

/**
 * Get single ticket by ID
 * Uses STALE_TIME for individual records
 */
function useTicket(id: TicketId) {
  return useApiQuery<ApiResponse<{ ticket: Ticket }>>(
    QueryKeys.tickets.detail(id),
    {
      url: API_ROUTES.TICKETS.BY_TICKET_ID(id),
      enabled: !!id,
      staleTime: CACHE.STALE_TIME,
    }
  );
}

/**
 * Create a new ticket
 */
function useCreateTicket() {
  return useApiMutation<ApiResponse<{ ticket: Ticket }>, FormData>({
    url: API_ROUTES.TICKETS.BASE,
    method: 'POST',
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    onSuccess: async () => {
      // Invalidate all tickets queries
      await queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.all(),
        exact: false,
      });
      // Invalidate project queries to refresh progress
      await queryClient.invalidateQueries({
        queryKey: QueryKeys.projects.all(),
        exact: false,
      });
    },
  });
}

/**
 * Update ticket status
 */
function useUpdateTicketStatus() {
  return useApiMutation<
    ApiResponse<{ ticket: Ticket }>,
    { id: TicketId; status: string }
  >({
    url: (vars) => API_ROUTES.TICKETS.STATUS(vars.id),
    method: 'PATCH',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
      // Invalidate project queries to refresh progress (Closed status affects completion count)
      queryClient.invalidateQueries({ queryKey: QueryKeys.projects.all() });
    },
  });
}

/**
 * Assign ticket to developer
 */
function useAssignTicket() {
  return useApiMutation<
    ApiResponse<{ ticket: Ticket }>,
    { id: TicketId; developerId: UserId }
  >({
    url: (vars) => API_ROUTES.TICKETS.ASSIGN(vars.id),
    method: 'PATCH',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
    },
  });
}

/**
 * Update ticket priority
 */
function useUpdateTicketPriority() {
  return useApiMutation<
    ApiResponse<{ ticket: Ticket }>,
    { id: TicketId; priority: string }
  >({
    url: (vars) => API_ROUTES.TICKETS.PRIORITY(vars.id),
    method: 'PATCH',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
    },
  });
}

/**
 * Update ticket details
 */
function useUpdateTicket() {
  return useApiMutation<
    ApiResponse<{ ticket: Ticket }>,
    { id: TicketId; data: Partial<TicketInput> }
  >({
    url: (vars) => API_ROUTES.TICKETS.BY_TICKET_ID(vars.id),
    method: 'PUT',
    getBody: (vars) => vars.data,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
    },
  });
}

/**
 * Delete a ticket
 */
function useDeleteTicket() {
  return useApiMutation<void, TicketId>({
    url: (id) => API_ROUTES.TICKETS.BY_TICKET_ID(id),
    method: 'DELETE',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
      // Invalidate project queries to refresh progress
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
  return useApiMutation<ApiResponse<BulkDeleteResult>, { ids: string[] }>({
    url: API_ROUTES.TICKETS.BASE,
    method: 'DELETE',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.all() });
      queryClient.invalidateQueries({ queryKey: QueryKeys.projects.all() });
    },
  });
}

/**
 * Bulk update ticket priority
 */
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

/**
 * Upload screen recording to a bug ticket
 */
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

/**
 * Upload attachments to an existing ticket
 */
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

/**
 * Delete attachment from a ticket
 */
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

/**
 * Delete screen recording from a ticket
 */
function useDeleteScreenRecording() {
  return useApiMutation<
    ApiResponse<{ ticket: Ticket }>,
    { ticketId: TicketId }
  >({
    url: (vars) => API_ROUTES.TICKETS.SCREEN_RECORDING(vars.ticketId),
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
  useUpdateTicketPriority,
  useBulkUpdatePriority,
  useDeleteTicket,
  useBulkDeleteTickets,
  useUploadScreenRecording,
  useUploadAttachments,
  useDeleteAttachment,
  useDeleteScreenRecording,
};
