import { useMemo, useState } from 'react';
import { UserRole } from '@/types';
import type {
  ViewMode,
  Tab,
  GroupByOption,
} from '@/shared/components/patterns';
import { TicketDialog, TicketListContent } from '@/features/tickets/components';
import { EmptyState, Button } from '@/shared/components/ui';
import { useRoleFlags } from '@/shared';
import { useTicketList, useTicketFilters } from '../hooks';
import { ListPageLayout } from '@/shared/components/layout/ListPageLayout';
import { useAppTranslation } from '@/shared/hooks';
import {
  TICKET_TABS_CONFIG,
  GROUP_BY_OPTIONS_CONFIG,
} from '../utils/ticket-options';
import { EmailTicketList } from '@/features/email-tickets/components/EmailTicketList';
import { useEmailTicketCount } from '@/features/email-tickets/api/email-tickets-api';

export default function TicketListPage() {
  const { translate } = useAppTranslation('tickets');

  const {
    tickets,
    allTickets,
    users = [],
    filters,
    isLoading,
    error,
    ticketsData,
    refetch,
    activeTab,
    userRole,
    onViewTicket,
    onFilterChange,
    onTabChange,
  } = useTicketList();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [groupByValue, setGroupByValue] = useState<string | null>(null);

  const { isDeveloper, isEngLead, isAdmin } = useRoleFlags(
    userRole as UserRole
  );
  const isInternalAdmin = isEngLead || isAdmin;

  const canCreateTicket = !isDeveloper;

  const { data: emailTicketCountData } = useEmailTicketCount();
  const pendingEmailCount = emailTicketCountData?.count ?? 0;

  const ticketTabs: Tab[] = useMemo(() => {
    const tabs = TICKET_TABS_CONFIG.filter(
      (tab) => tab.id !== 'emailTickets' || isInternalAdmin
    );
    return tabs.map(({ labelKey, ...rest }) => ({
      ...rest,
      label:
        rest.id === 'emailTickets' && pendingEmailCount > 0
          ? `${translate(labelKey)} (${pendingEmailCount})`
          : translate(labelKey),
    }));
  }, [isInternalAdmin, pendingEmailCount, translate]);

  const groupByOptions: GroupByOption[] = GROUP_BY_OPTIONS_CONFIG.map(
    ({ labelKey, ...rest }) => ({
      ...rest,
      label: translate(labelKey),
    })
  );

  const {
    filterPanelValue,
    sortOptions,
    sortValue,
    filterBarFilters,
    filterGroups,
    handleFilterPanelChange,
    handleFilterBarChange,
    handleSortChange,
  } = useTicketFilters({ filters, users, tickets: allTickets, onFilterChange });

  if (!userRole) {
    return (
      <EmptyState
        variant="error"
        title={translate('errors.invalidRole')}
        message={translate('errors.invalidRoleMessage')}
      />
    );
  }

  const showCards = viewMode === 'grid';
  const currentTab = ticketTabs.find((tab) => tab.id === activeTab);
  const isEmailTicketsTab = activeTab === 'emailTickets';

  return (
    <>
      <ListPageLayout
        title={translate('title')}
        count={isEmailTicketsTab ? undefined : tickets.length}
        tabs={ticketTabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        tabActions={
          !isEmailTicketsTab && canCreateTicket ? (
            <Button leftIcon="plus" onClick={() => setIsCreateDialogOpen(true)}>
              {translate('create')}
            </Button>
          ) : null
        }
        filters={isEmailTicketsTab ? undefined : filterBarFilters}
        onFilterChange={isEmailTicketsTab ? undefined : handleFilterBarChange}
        sortOptions={isEmailTicketsTab ? undefined : sortOptions}
        sortValue={isEmailTicketsTab ? undefined : sortValue}
        onSortChange={isEmailTicketsTab ? undefined : handleSortChange}
        groupByOptions={isEmailTicketsTab ? undefined : groupByOptions}
        groupByValue={isEmailTicketsTab ? null : groupByValue}
        onGroupByChange={isEmailTicketsTab ? undefined : setGroupByValue}
        filterGroups={isEmailTicketsTab ? undefined : filterGroups}
        filterPanelValue={isEmailTicketsTab ? undefined : filterPanelValue}
        onFilterPanelChange={
          isEmailTicketsTab ? undefined : handleFilterPanelChange
        }
        filterPanelSingleSelect
        viewMode={isEmailTicketsTab ? undefined : viewMode}
        onViewChange={isEmailTicketsTab ? undefined : setViewMode}
        showFilter={!isEmailTicketsTab}
        loading={isEmailTicketsTab ? false : isLoading}
        loadingMessage={translate('list.loading')}
      >
        {isEmailTicketsTab ? (
          <EmailTicketList />
        ) : (
          <TicketListContent
            tickets={tickets}
            users={users}
            error={error}
            hasData={!!ticketsData}
            showCards={showCards}
            groupByValue={groupByValue}
            currentTab={currentTab}
            onViewTicket={onViewTicket}
            onRetry={refetch}
          />
        )}
      </ListPageLayout>

      <TicketDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={refetch}
      />
    </>
  );
}
