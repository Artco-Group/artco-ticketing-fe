import { useEffect } from 'react';
import { usePageHeaderContext } from './usePageHeaderContext';

/**
 * Hook for pages to set the count badge in the PageHeader.
 * The count will be reset when the component unmounts.
 *
 * @example
 * ```tsx
 * function TicketListPage() {
 *   const { tickets } = useTickets();
 *   usePageHeader({ count: tickets.length });
 *   // ...
 * }
 * ```
 */
export function usePageHeader({ count }: { count?: number }) {
  const { setCount } = usePageHeaderContext();

  useEffect(() => {
    setCount(count);
    return () => setCount(undefined);
  }, [count, setCount]);
}
