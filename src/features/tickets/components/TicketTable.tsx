import { useState } from 'react';
import { TicketPriority, TicketStatus, type Ticket, type User } from '@/types';
import {
  DataTable,
  EmptyState,
  Icon,
  Avatar,
  BulkActionsBar,
  type Column,
  type SortDirection,
  type RowAction,
  type BulkAction,
} from '@/shared/components/ui';
import {
  resolveAssigneeName,
  getPriorityIcon,
  getPriorityLabel,
  getStatusIcon,
  getStatusLabel,
  PRIORITY_ORDER,
  STATUS_ORDER,
} from '@/shared/utils/ticket-helpers';

interface TicketTableProps {
  tickets: Ticket[];
  users: User[];
  onViewTicket: (ticket: Ticket) => void;
}

function TicketTable({ tickets, users, onViewTicket }: TicketTableProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const rowActions: RowAction<Ticket>[] = [
    {
      label: 'View Details',
      icon: <Icon name="eye" size="sm" />,
      onClick: (ticket) => onViewTicket(ticket),
    },
  ];

  const bulkActions: BulkAction[] = [
    {
      label: 'Change Priority',
      icon: <Icon name="edit" size="sm" />,
      onClick: () => {
        // TODO: Implement bulk priority change
      },
    },
    {
      label: 'Delete',
      icon: <Icon name="trash" size="sm" />,
      onClick: () => {
        // TODO: Implement bulk delete
      },
      variant: 'destructive',
    },
  ];

  const columns: Column<Ticket>[] = [
    {
      key: 'name',
      label: 'Name',
      width: 'w-full',
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
      sortable: true,
      sortValue: (ticket) => STATUS_ORDER[ticket.status] ?? 0,
      getBadgeProps: (_value, ticket) => ({
        icon: getStatusIcon(ticket.status as TicketStatus),
        children: getStatusLabel(ticket.status as TicketStatus),
      }),
    },
    {
      key: 'assignedTo',
      label: 'Assignee',
      align: 'center',
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
            <Avatar size="md" fallback={assigneeName} tooltip={assigneeName} />
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Due date',
      type: 'date',
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
      sortable: true,
      sortValue: (ticket) => PRIORITY_ORDER[ticket.priority] ?? 0,
      getBadgeProps: (_value, ticket) => ({
        icon: getPriorityIcon(ticket.priority as TicketPriority),
        children: getPriorityLabel(ticket.priority as TicketPriority),
      }),
    },
  ];

  const emptyState = (
    <EmptyState
      variant="no-tickets"
      title="No tickets found"
      message="No tickets match your current filters."
      className="min-h-0 py-12"
    />
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={tickets}
        onRowClick={onViewTicket}
        emptyState={emptyState}
        selectable
        selectedRows={selectedRows}
        onSelect={setSelectedRows}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={(col, dir) => {
          setSortColumn(col);
          setSortDirection(dir);
        }}
        actions={rowActions}
      />
      <BulkActionsBar
        selectedCount={selectedRows.length}
        actions={bulkActions}
        onClear={() => setSelectedRows([])}
      />
    </>
  );
}

export default TicketTable;
