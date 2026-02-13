import { useState } from 'react';
import { UserRole } from '@/types';
import type { ViewMode } from '@/shared/components/patterns';
import { TicketDialog, TicketListContent } from '@/features/tickets/components';
import { EmptyState, Button } from '@/shared/components/ui';
import { useRoleFlags } from '@/shared';
import { useTicketList, useTicketFilters } from '../hooks';
import { ListPageLayout } from '@/shared/components/layout/ListPageLayout';
import { TICKET_TABS, GROUP_BY_OPTIONS } from './ticketListPage.constants';

export default function TicketListPage() {
  const {
    tickets,
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

  const { isClient, isDeveloper } = useRoleFlags(userRole as UserRole);

  // Developers cannot create tickets
  const canCreateTicket = !isDeveloper;

  const {
    filterPanelValue,
    sortOptions,
    sortValue,
    filterBarFilters,
    filterGroups,
    handleFilterPanelChange,
    handleFilterBarChange,
    handleSortChange,
  } = useTicketFilters({ filters, users, onFilterChange });

  if (!userRole) {
    return (
      <EmptyState
        variant="error"
        title="Invalid Role"
        message="Your account has an invalid role. Please contact support."
      />
    );
  }

  const showCards = isClient || viewMode === 'grid';
  const currentTab = TICKET_TABS.find((tab) => tab.id === activeTab);

  return (
    <>
      <ListPageLayout
        title="Tickets"
        count={tickets.length}
        tabs={TICKET_TABS}
        activeTab={activeTab}
        onTabChange={onTabChange}
        tabActions={
          canCreateTicket ? (
            <Button leftIcon="plus" onClick={() => setIsCreateDialogOpen(true)}>
              Create Ticket
            </Button>
          ) : null
        }
        filters={filterBarFilters}
        onFilterChange={handleFilterBarChange}
        sortOptions={sortOptions}
        sortValue={sortValue}
        onSortChange={handleSortChange}
        groupByOptions={GROUP_BY_OPTIONS}
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
        loadingMessage="Loading tickets..."
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
