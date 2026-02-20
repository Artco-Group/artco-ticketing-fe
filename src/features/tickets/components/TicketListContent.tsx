import type { Ticket, User } from '@/types';
import type { Tab } from '@/shared/components/patterns';
import { EmptyState, RetryableError, Icon } from '@/shared/components/ui';
import { StatusHeader } from '@/shared/components/patterns/StatusHeader';
import { useAppTranslation } from '@/shared/hooks';
import TicketCard from './TicketCard';
import TicketTable from './TicketTable';

interface TicketListContentProps {
  tickets: Ticket[];
  users: User[];
  error: Error | null;
  hasData: boolean;
  showCards: boolean;
  groupByValue: string | null;
  currentTab: Tab | undefined;
  onViewTicket: (ticket: Ticket) => void;
  onRetry: () => void;
}

export function TicketListContent({
  tickets,
  users,
  error,
  hasData,
  showCards,
  groupByValue,
  currentTab,
  onViewTicket,
  onRetry,
}: TicketListContentProps) {
  const { translate } = useAppTranslation('tickets');

  if (error) {
    return (
      <RetryableError
        title={translate('list.failedToLoad')}
        message={translate('list.failedToLoadMessage')}
        onRetry={onRetry}
      />
    );
  }

  if (!hasData || tickets.length === 0) {
    return (
      <EmptyState
        variant="no-tickets"
        title={translate('list.noTasksFound')}
        message={translate('list.noTasksMatch')}
      />
    );
  }

  if (showCards) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={onViewTicket}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {!groupByValue && currentTab && (
        <StatusHeader
          icon={
            currentTab.icon ? <Icon name={currentTab.icon} size="sm" /> : null
          }
          label={currentTab.label}
        />
      )}
      <TicketTable
        tickets={tickets}
        users={users}
        onViewTicket={onViewTicket}
        groupByValue={groupByValue}
      />
    </>
  );
}
