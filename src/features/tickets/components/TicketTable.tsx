import { useMemo } from 'react';
import {
  TicketCategorySortOrder,
  TicketStatusSortOrder,
  TicketPrioritySortOrder,
  formatDateDisplay,
} from '@artco-group/artco-ticketing-sync';
import type { StatusConfig } from '@artco-group/artco-ticketing-sync/types';
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
import { useAppTranslation, useStatusLabel } from '@/shared/hooks';
import {
  resolveAssigneeName,
  getPriorityIcon,
  getDynamicStatusIcon,
  getCategoryIcon,
} from '@/shared/utils/ticket-helpers';
import { useTicketTableState, useTranslatedOptions } from '../hooks';
import { PrioritySelectDialog } from './PrioritySelectDialog';

interface TicketTableProps {
  tickets: Ticket[];
  users: User[];
  onViewTicket: (ticket: Ticket) => void;
  groupByValue?: string | null;
  statusConfig?: StatusConfig | null;
  showProjectColumn?: boolean;
}

function TicketTable({
  tickets,
  users,
  onViewTicket,
  groupByValue,
  showProjectColumn = true,
  statusConfig,
}: TicketTableProps) {
  const { translate, language } = useAppTranslation('tickets');
  const { getPriorityLabel, getCategoryLabel } = useTranslatedOptions();
  const { getStatusLabel } = useStatusLabel();

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
        label: translate('bulkActions.delete'),
        icon: <Icon name="trash" size="sm" />,
        onClick: (ticket) => {
          if (ticket.ticketId) {
            setSelectedRows([ticket.ticketId]);
            setShowDeleteConfirm(true);
          }
        },
      },
    ],
    [setSelectedRows, setShowDeleteConfirm, translate]
  );

  const columns: Column<Ticket>[] = useMemo(() => {
    const baseColumns: Column<Ticket>[] = [
      {
        key: 'name',
        label: translate('table.columns.name'),
        width: showProjectColumn ? 'w-[30%]' : 'w-[34%]',
        sortable: true,
        render: (ticket) => (
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground shrink-0 font-mono text-sm">
              {ticket.ticketId}
            </span>
            <span className="text-foreground font-medium">{ticket.title}</span>
          </div>
        ),
      },
      {
        key: 'status',
        label: translate('table.columns.status'),
        type: 'badge',
        width: 'w-[10%]',
        sortable: true,
        sortValue: (ticket) => {
          const config = statusConfig ?? ticket.project?.statusConfig;
          if (config?.statuses) {
            const status = config.statuses.find((s) => s.id === ticket.status);
            return status?.sortOrder ?? 999;
          }
          return TicketStatusSortOrder[ticket.status as TicketStatus] ?? 0;
        },
        getBadgeProps: (_value, ticket) => {
          const config = statusConfig ?? ticket.project?.statusConfig;
          return {
            icon: getDynamicStatusIcon(ticket.status, config),
            children: getStatusLabel(ticket.status, config),
          };
        },
      },
      {
        key: 'category',
        label: translate('table.columns.category'),
        type: 'badge',
        width: 'w-[13%]',
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
        label: translate('table.columns.assignee'),
        align: 'center',
        width: 'w-[6%]',
        sortable: true,
        sortValue: (ticket) =>
          ticket.assignedTo
            ? resolveAssigneeName(ticket.assignedTo, users).toLowerCase()
            : 'zzz',
        render: (ticket) => {
          const assigneeName = ticket.assignedTo
            ? resolveAssigneeName(ticket.assignedTo, users)
            : translate('table.unassigned');
          return (
            <div className="flex justify-center">
              <Avatar
                size="md"
                src={ticket.assignedTo?.profilePic ?? undefined}
                fallback={assigneeName}
                tooltip={assigneeName}
              />
            </div>
          );
        },
      },
    ];

    if (showProjectColumn) {
      baseColumns.push({
        key: 'project',
        label: translate('table.columns.project'),
        align: 'center',
        width: 'w-[6%]',
        sortable: true,
        sortValue: (ticket) => ticket.project?.name?.toLowerCase() ?? 'zzz',
        render: (ticket) => {
          const projectName = ticket.project?.name;
          const clientName = ticket.project?.client?.name;
          const clientPic = ticket.project?.client?.profilePic;
          if (!projectName) {
            return null;
          }
          return (
            <div className="flex justify-center">
              <Avatar
                size="md"
                src={clientPic}
                fallback={clientName || projectName}
                tooltip={projectName}
              />
            </div>
          );
        },
      });
    }

    baseColumns.push(
      {
        key: 'createdAt',
        label: translate('table.columns.dueDate'),
        type: 'date',
        width: 'w-[12%]',
        sortable: true,
        formatDate: (date) => formatDateDisplay(date, language, 'long'),
      },
      {
        key: 'priority',
        label: translate('table.columns.priority'),
        type: 'badge',
        width: 'w-[11%]',
        sortable: true,
        sortValue: (ticket) =>
          TicketPrioritySortOrder[ticket.priority as TicketPriority] ?? 0,
        getBadgeProps: (_value, ticket) => ({
          icon: getPriorityIcon(ticket.priority as TicketPriority),
          children: getPriorityLabel(ticket.priority as TicketPriority),
        }),
      }
    );

    return baseColumns;
  }, [
    users,
    translate,
    language,
    getPriorityLabel,
    getCategoryLabel,
    getStatusLabel,
    statusConfig,
    showProjectColumn,
  ]);

  const emptyState = (
    <EmptyState
      variant="no-tickets"
      title={translate('list.noTasksFound')}
      message={translate('list.noTasksMatch')}
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
        title={translate('table.deleteTitle')}
        description={translate('table.deleteConfirm', {
          count: selectedRows.length,
        })}
        confirmLabel={translate('table.deleteButton')}
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
