import { useMemo } from 'react';
import {
  TicketCategorySortOrder,
  TicketStatusSortOrder,
  TicketPrioritySortOrder,
} from '@artco-group/artco-ticketing-sync';
import {
  TicketCategory,
  TicketPriority,
  TicketStatus,
  type Ticket,
  type User,
} from '@/types';
import {
  DataTable,
  EmptyState,
  Icon,
  Avatar,
  BulkActionsBar,
  ConfirmationDialog,
  type Column,
  type RowAction,
} from '@/shared/components/ui';
import { StatusHeader } from '@/shared/components/patterns/StatusHeader';
import { useGroupedData } from '@/shared/hooks/useGroupedData';
import {
  resolveAssigneeName,
  getPriorityIcon,
  getPriorityLabel,
  getStatusIcon,
  getStatusLabel,
  getCategoryIcon,
  getCategoryLabel,
} from '@/shared/utils/ticket-helpers';
import { useTicketTableState } from '../hooks/useTicketTableState';
import { PrioritySelectDialog } from './PrioritySelectDialog';

interface TicketTableProps {
  tickets: Ticket[];
  users: User[];
  onViewTicket: (ticket: Ticket) => void;
  groupByValue?: string | null;
}

function TicketTable({
  tickets,
  users,
  onViewTicket,
  groupByValue,
}: TicketTableProps) {
  const {
    selectedRows,
    setSelectedRows,
    clearSelection,
    sortColumn,
    sortDirection,
    handleSort,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleBulkDelete,
    isDeleting,
    showPriorityDialog,
    setShowPriorityDialog,
    handleBulkPriorityChange,
    isUpdatingPriority,
    bulkActions,
    groupConfigs,
  } = useTicketTableState({ users });

  const groupedTickets = useGroupedData(
    tickets,
    groupByValue ?? null,
    groupConfigs
  );

  const rowActions: RowAction<Ticket>[] = useMemo(
    () => [
      {
        label: 'Delete',
        icon: <Icon name="trash" size="sm" />,
        onClick: (ticket) => {
          if (ticket.ticketId) {
            setSelectedRows([ticket.ticketId]);
            setShowDeleteConfirm(true);
          }
        },
      },
    ],
    [setSelectedRows, setShowDeleteConfirm]
  );

  const columns: Column<Ticket>[] = useMemo(
    () => [
      {
        key: 'name',
        label: 'Name',
        width: 'w-[45%]',
        sortable: true,
        render: (ticket) => (
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground font-mono text-sm">
              {ticket.ticketId}
            </span>
            <span className="text-foreground font-medium">{ticket.title}</span>
          </div>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        type: 'badge',
        width: 'w-[15%]',
        sortable: true,
        sortValue: (ticket) =>
          TicketStatusSortOrder[ticket.status as TicketStatus] ?? 0,
        getBadgeProps: (_value, ticket) => ({
          icon: getStatusIcon(ticket.status as TicketStatus),
          children: getStatusLabel(ticket.status as TicketStatus),
        }),
      },
      {
        key: 'category',
        label: 'Category',
        type: 'badge',
        width: 'w-[10%]',
        sortable: true,
        sortValue: (ticket) =>
          TicketCategorySortOrder[ticket.category as TicketCategory] ?? 0,
        getBadgeProps: (_value, ticket) => ({
          icon: getCategoryIcon(ticket.category as TicketCategory),
          children: getCategoryLabel(ticket.category as TicketCategory),
        }),
      },
      {
        key: 'assignedTo',
        label: 'Assignee',
        align: 'center',
        width: 'w-[10%]',
        sortable: true,
        sortValue: (ticket) =>
          ticket.assignedTo
            ? resolveAssigneeName(ticket.assignedTo, users).toLowerCase()
            : 'zzz',
        render: (ticket) => {
          const assigneeName = ticket.assignedTo
            ? resolveAssigneeName(ticket.assignedTo, users)
            : 'Unassigned';
          return (
            <div className="flex justify-center">
              <Avatar
                size="md"
                fallback={assigneeName}
                tooltip={assigneeName}
              />
            </div>
          );
        },
      },
      {
        key: 'createdAt',
        label: 'Due date',
        type: 'date',
        width: 'w-[20%]',
        sortable: true,
        formatDate: (date) => {
          const d = date instanceof Date ? date : new Date(date);
          return d.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          });
        },
      },
      {
        key: 'priority',
        label: 'Priority',
        type: 'badge',
        width: 'w-[15%]',
        sortable: true,
        sortValue: (ticket) =>
          TicketPrioritySortOrder[ticket.priority as TicketPriority] ?? 0,
        getBadgeProps: (_value, ticket) => ({
          icon: getPriorityIcon(ticket.priority as TicketPriority),
          children: getPriorityLabel(ticket.priority as TicketPriority),
        }),
      },
    ],
    [users]
  );

  const emptyState = (
    <EmptyState
      variant="no-tickets"
      title="No tickets found"
      message="No tickets match your current filters."
      className="min-h-0 py-12"
    />
  );

  const tableProps = {
    columns,
    onRowClick: onViewTicket,
    emptyState,
    selectable: true,
    selectedRows,
    onSelect: setSelectedRows,
    sortColumn,
    sortDirection,
    onSort: handleSort,
    actions: rowActions,
    getRowId: (ticket: Ticket) => ticket.ticketId ?? '',
  };

  const renderDialogs = () => (
    <>
      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleBulkDelete}
        title="Delete tickets"
        description={`Are you sure you want to delete ${selectedRows.length} ticket${selectedRows.length > 1 ? 's' : ''}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={isDeleting}
        icon="trash"
      />
      <PrioritySelectDialog
        isOpen={showPriorityDialog}
        onClose={() => setShowPriorityDialog(false)}
        onSelect={handleBulkPriorityChange}
        selectedCount={selectedRows.length}
        isLoading={isUpdatingPriority}
      />
    </>
  );

  if (groupByValue && groupedTickets.length > 0) {
    return (
      <>
        {groupedTickets.map((group) => (
          <div key={group.key}>
            <StatusHeader icon={group.icon} label={group.label} />
            <DataTable {...tableProps} data={group.items} />
          </div>
        ))}
        <BulkActionsBar
          selectedCount={selectedRows.length}
          actions={bulkActions}
          onClear={clearSelection}
        />
        {renderDialogs()}
      </>
    );
  }

  return (
    <>
      <DataTable {...tableProps} data={tickets} />
      <BulkActionsBar
        selectedCount={selectedRows.length}
        actions={bulkActions}
        onClear={clearSelection}
      />
      {renderDialogs()}
    </>
  );
}

export default TicketTable;
