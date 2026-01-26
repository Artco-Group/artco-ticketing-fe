import { useMemo } from 'react';
import type { Ticket } from '@/types';

interface TicketSummary {
  totalOpen: number;
  unassigned: number;
  critical: number;
  total: number;
}

/**
 * Custom hook to calculate ticket summary statistics.
 * Centralizes ticket filtering/counting logic used in dashboards and lists.
 *
 * @param tickets - Array of tickets to summarize
 * @returns Object with calculated summary counts
 *
 * @example
 * const { totalOpen, unassigned, critical, total } = useTicketSummary(tickets);
 */
export function useTicketSummary(tickets: Ticket[]): TicketSummary {
  return useMemo(
    () => ({
      totalOpen: tickets.filter(
        (t) => t.status !== 'Closed' && t.status !== 'Resolved'
      ).length,
      unassigned: tickets.filter((t) => !t.assignedTo).length,
      critical: tickets.filter((t) => t.priority === 'Critical').length,
      total: tickets.length,
    }),
    [tickets]
  );
}
