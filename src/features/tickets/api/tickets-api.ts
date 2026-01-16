import { useApiQuery, useApiMutation } from '@/shared/lib/api-hooks';
import { QueryKeys } from '@/shared/lib/query-keys';
import { queryClient } from '@/shared/lib/query-client';
import type { Ticket } from '@/types';
import api from '@/shared/lib/api-client';

// Legacy API object for backward compatibility
export const ticketAPI = {
  getTickets: () => api.get('/tickets'),
  getTicket: (ticketId: string) => api.get(`/tickets/${ticketId}`),
  createTicket: (ticket: FormData) => api.post('/tickets', ticket),
  updateTicket: (ticketId: string, ticket: FormData) =>
    api.put(`/tickets/${ticketId}`, ticket),
  updateTicketStatus: (ticketId: string, status: string) =>
    api.patch(`/tickets/${ticketId}/status`, { status }),
  updateTicketAssignee: (ticketId: string, developerId: string) =>
    api.patch(`/tickets/${ticketId}/assign`, { developerId }),
  updateTicketPriority: (ticketId: string, priority: string) =>
    api.patch(`/tickets/${ticketId}/priority`, { priority }),
  deleteTicket: (ticketId: string) => api.delete(`/tickets/${ticketId}`),
};

// New React Query hooks
export function useTickets(params?: Record<string, unknown>) {
  return useApiQuery<{ tickets: Ticket[] }>(QueryKeys.tickets.list(params), {
    url: '/tickets',
    params,
  });
}

export function useTicket(id: string) {
  return useApiQuery<{ ticket: Ticket }>(QueryKeys.tickets.detail(id), {
    url: `/tickets/${id}`,
    enabled: !!id,
  });
}

export function useCreateTicket() {
  return useApiMutation<{ ticket: Ticket }, FormData>({
    url: '/tickets',
    method: 'POST',
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.lists() });
    },
  });
}

export function useUpdateTicketStatus() {
  return useApiMutation<{ ticket: Ticket }, { id: string; status: string }>({
    url: (vars) => `/tickets/${vars.id}/status`,
    method: 'PATCH',
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.lists() });
    },
  });
}

export function useAssignTicket() {
  return useApiMutation<{ ticket: Ticket }, { id: string; assignedTo: string }>(
    {
      url: (vars) => `/tickets/${vars.id}/assign`,
      method: 'PATCH',
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: QueryKeys.tickets.detail(variables.id),
        });
        queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.lists() });
      },
    }
  );
}

export function useDeleteTicket() {
  return useApiMutation<void, string>({
    url: (id) => `/tickets/${id}`,
    method: 'DELETE',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.lists() });
    },
  });
}
