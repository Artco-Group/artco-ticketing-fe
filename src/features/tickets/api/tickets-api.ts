import { useApiQuery, useApiMutation } from '../../../shared/lib/api-hooks';
import { QueryKeys } from '../../../shared/lib/query-keys';
import { queryClient } from '../../../shared/lib/query-client';
import type { Ticket } from '../../../interfaces/ticket/Ticket';

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
    // Don't set Content-Type manually - axios will set it automatically with boundary for FormData
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.lists() });
    },
  });
}

export function useUpdateTicket() {
  return useApiMutation<{ ticket: Ticket }, { id: string; ticket: FormData }>({
    url: (variables) => `/tickets/${variables.id}`,
    method: 'PUT',
    getData: (variables) => variables.ticket,
    // Don't set Content-Type manually - axios will set it automatically with boundary for FormData
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.lists() });
    },
  });
}

export function useUpdateTicketStatus() {
  return useApiMutation<{ ticket: Ticket }, { id: string; status: string }>({
    url: (variables) => `/tickets/${variables.id}/status`,
    method: 'PATCH',
    getData: (variables) => ({ status: variables.status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.lists() });
    },
  });
}

export function useAssignTicket() {
  return useApiMutation<
    { ticket: Ticket },
    { id: string; developerId: string }
  >({
    url: (variables) => `/tickets/${variables.id}/assign`,
    method: 'PATCH',
    getData: (variables) => ({ developerId: variables.developerId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.lists() });
    },
  });
}

export function useUpdateTicketPriority() {
  return useApiMutation<{ ticket: Ticket }, { id: string; priority: string }>({
    url: (variables) => `/tickets/${variables.id}/priority`,
    method: 'PATCH',
    getData: (variables) => ({ priority: variables.priority }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QueryKeys.tickets.lists() });
    },
  });
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
