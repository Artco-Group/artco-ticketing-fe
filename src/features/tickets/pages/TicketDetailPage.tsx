import { QueryStateWrapper, EmptyState, Button } from '@/shared/components/ui';
import { PageHeader } from '@/shared/components';
import { PAGE_ROUTES } from '@/shared/constants';
import { useRoleFlags } from '@/shared';
import { TicketDetail, TicketDialog } from '../components';
import { useTicketDetail } from '../hooks';
import { useAppTranslation } from '@/shared/hooks';

export default function TicketDetailPage() {
  const { translate } = useAppTranslation('tickets');

  const {
    ticket,
    currentUser,
    users,
    projects,
    ticketLoading,
    ticketError,
    refetchTicket,
    ticketRefetching,
    isEditModalOpen,
    onOpenEditModal,
    onCloseEditModal,
    onBack,
    onStatusUpdate,
    onPriorityUpdate,
    onAssignTicket,
  } = useTicketDetail();

  const { isEngLead, isAdmin } = useRoleFlags(currentUser?.role);

  const canEditTicket = isEngLead || isAdmin;

  if (!currentUser?.role) {
    return (
      <EmptyState
        variant="error"
        title={translate('errors.accessDenied')}
        message={translate('errors.accessDeniedMessage')}
      />
    );
  }

  return (
    <div className="bg-background flex min-h-full flex-col">
      <PageHeader
        breadcrumbs={
          ticket
            ? [
                {
                  label: translate('list.title'),
                  href: PAGE_ROUTES.TICKETS.LIST,
                },
                { label: ticket.title || `#${ticket.ticketId}`, href: '#' },
              ]
            : undefined
        }
      />

      <QueryStateWrapper
        isLoading={ticketLoading}
        error={ticketError}
        data={ticket}
        loadingMessage={translate('details.loading')}
        errorTitle={translate('details.failedToLoad')}
        errorMessage={translate('details.failedToLoadMessage')}
        onRetry={refetchTicket}
        isRefetching={ticketRefetching}
        emptyTitle={translate('details.notFound')}
        emptyMessage={translate('details.notFoundMessage')}
        emptyAction={
          <Button onClick={onBack}>
            {translate('details.backToDashboard')}
          </Button>
        }
      >
        {(ticketData) => (
          <TicketDetail
            ticket={ticketData}
            currentUser={currentUser}
            users={users}
            projects={projects}
            onBack={onBack}
            onStatusUpdate={onStatusUpdate}
            onPriorityUpdate={onPriorityUpdate}
            onAssignTicket={onAssignTicket}
            onEdit={onOpenEditModal}
          />
        )}
      </QueryStateWrapper>

      {canEditTicket && ticket && (
        <TicketDialog
          isOpen={isEditModalOpen}
          onClose={onCloseEditModal}
          ticket={ticket}
          onSuccess={refetchTicket}
        />
      )}
    </div>
  );
}
