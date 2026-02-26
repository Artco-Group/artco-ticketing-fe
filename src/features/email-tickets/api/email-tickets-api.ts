import { useApiQuery, useApiMutation } from '@/shared/lib/api-hooks';
import {
  QueryKeys,
  API_ROUTES,
  CACHE,
  EmailTicketStatus,
  type EmailTicket,
  type ApiResponse,
} from '@artco-group/artco-ticketing-sync';
import { queryClient } from '@/shared/lib/query-client';

export function useEmailTickets(status?: EmailTicketStatus) {
  return useApiQuery<{ emailTickets: EmailTicket[] }>(
    QueryKeys.emailTickets.list(status ? { status } : undefined),
    {
      url: API_ROUTES.EMAIL_TICKETS.BASE,
      params: status ? { status } : undefined,
      staleTime: CACHE.SHORT_STALE_TIME,
    }
  );
}

export function useEmailTicketCount() {
  return useApiQuery<{ count: number }>(QueryKeys.emailTickets.count(), {
    url: API_ROUTES.EMAIL_TICKETS.COUNT,
    staleTime: CACHE.SHORT_STALE_TIME,
  });
}

export function useDismissEmailTicket() {
  return useApiMutation<
    ApiResponse<{ emailTicket: EmailTicket }>,
    { id: string }
  >({
    url: (vars) => API_ROUTES.EMAIL_TICKETS.DISMISS(vars.id),
    method: 'PATCH',
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.emailTickets.all(),
      });
    },
  });
}

export function useConvertEmailTicket() {
  return useApiMutation<
    ApiResponse<{ emailTicket: EmailTicket }>,
    { id: string; ticketId: string }
  >({
    url: (vars) => API_ROUTES.EMAIL_TICKETS.CONVERT(vars.id),
    method: 'PATCH',
    getBody: (vars) => ({ ticketId: vars.ticketId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.emailTickets.all(),
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.tickets.all(),
      });
    },
  });
}
