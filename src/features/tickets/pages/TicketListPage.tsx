import { useState } from 'react';
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

  const { isDeveloper } = useRoleFlags(userRole as UserRole);

  const canCreateTicket = !isDeveloper;

  const ticketTabs: Tab[] = TICKET_TABS_CONFIG.map(({ labelKey, ...rest }) => ({
    ...rest,
    label: translate(labelKey),
  }));

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

  return (
    <>
      <ListPageLayout
        title={translate('title')}
        count={tickets.length}
        tabs={ticketTabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        tabActions={
          canCreateTicket ? (
            <Button leftIcon="plus" onClick={() => setIsCreateDialogOpen(true)}>
              {translate('create')}
            </Button>
          ) : null
        }
        filters={filterBarFilters}
        onFilterChange={handleFilterBarChange}
        sortOptions={sortOptions}
        sortValue={sortValue}
        onSortChange={handleSortChange}
        groupByOptions={groupByOptions}
        groupByValue={groupByValue}
        onGroupByChange={setGroupByValue}
        filterGroups={filterGroups}
        filterPanelValue={filterPanelValue}
        onFilterPanelChange={handleFilterPanelChange}
        filterPanelSingleSelect
        viewMode={viewMode}
        onViewChange={setViewMode}
        showFilter
        loading={isLoading}
        loadingMessage={translate('list.loading')}
      >
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
      </ListPageLayout>

      <TicketDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={refetch}
      />
    </>
  );
}
