import { useState } from 'react';
import {
  UserRole,
  TicketPriority,
  type Ticket,
  type User,
} from '@/types';
import {
  useRoleFlags,
  SummaryCards,
  DataTable,
  type Column,
  Button,
  EmptyState,
  Icon,
  Avatar,
  type SortDirection,
  type RowAction,
  BulkActionsBar,
  type BulkAction,
} from '@/shared';
import {
  resolveAssigneeName,
  getPriorityIcon,
  getPriorityLabel,
  PRIORITY_ORDER,
} from '@/shared/utils/ticket-helpers';
import TicketCard from './TicketCard';

type ViewMode = 'grid' | 'list';

interface TicketListProps {
  tickets: Ticket[];
  allTickets?: Ticket[];
  users?: User[];
  userRole: UserRole;
  onViewTicket: (ticket: Ticket) => void;
  onCreateTicket?: () => void;
  viewMode?: ViewMode;
}

function TicketList({
  tickets,
  allTickets,
  users = [],
  userRole,
  onViewTicket,
  onCreateTicket,
  viewMode = 'list',
}: TicketListProps) {
  const { isEngLead, isDeveloper, isClient } = useRoleFlags(userRole);

  // Client always uses card layout
  if (isClient) {
    return (
      <ClientLayout
        tickets={tickets}
        onCreateTicket={onCreateTicket}
        onViewTicket={onViewTicket}
      />
    );
  }

  // Grid mode shows cards, List mode shows table
  if (viewMode === 'grid') {
    return (
      <GridLayout
        tickets={tickets}
        allTickets={allTickets}
        isEngLead={isEngLead}
        onViewTicket={onViewTicket}
      />
    );
  }

  // Eng Lead and Developer use table layout
  return (
    <TableLayout
      tickets={tickets}
      allTickets={allTickets}
      users={users}
      isEngLead={isEngLead}
      isDeveloper={isDeveloper}
      onViewTicket={onViewTicket}
    />
  );
}

// Client card-based layout
interface ClientLayoutProps {
  tickets: Ticket[];
  onCreateTicket?: () => void;
  onViewTicket: (ticket: Ticket) => void;
}

function ClientLayout({
  tickets,
  onCreateTicket,
  onViewTicket,
}: ClientLayoutProps) {
  return (
    <div className="p-6">
      {tickets.length === 0 ? (
        <ClientEmptyState onCreateTicket={onCreateTicket} />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket._id || ticket.id}
              ticket={ticket}
              onClick={onViewTicket}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ClientEmptyState({ onCreateTicket }: { onCreateTicket?: () => void }) {
  return (
    <EmptyState
      variant="no-tickets"
      title="No Tasks Found"
      message="Create your first task"
      action={
        onCreateTicket && (
          <Button
            onClick={onCreateTicket}
            size="lg"
            className="bg-greyscale-900 hover:bg-greyscale-800 text-white"
          >
            <Icon name="plus" size="lg" className="mr-2" />
            Create Task
          </Button>
        )
      }
      className="min-h-0 py-20"
    />
  );
}

// Grid layout for Eng Lead and Developer (card view)
interface GridLayoutProps {
  tickets: Ticket[];
  allTickets?: Ticket[];
  isEngLead: boolean;
  onViewTicket: (ticket: Ticket) => void;
}

function GridLayout({
  tickets,
  allTickets,
  isEngLead,
  onViewTicket,
}: GridLayoutProps) {
  return (
    <div className="p-6">
      <h1 className="text-foreground mb-6 text-2xl font-bold">All Tickets</h1>

      {/* Summary Cards - Only for Eng Lead */}
      {isEngLead && allTickets && <SummaryCards tickets={allTickets} />}

      {tickets.length === 0 ? (
        <EmptyState
          variant="no-tickets"
          title="No tickets found"
          message="No tickets match your current filters."
          className="min-h-0 py-12"
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket._id || ticket.id}
              ticket={ticket}
              onClick={onViewTicket}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Table layout for Eng Lead and Developer
interface TableLayoutProps {
  tickets: Ticket[];
  allTickets?: Ticket[];
  users: User[];
  isEngLead: boolean;
  isDeveloper: boolean;
  onViewTicket: (ticket: Ticket) => void;
}

function TableLayout({
  tickets,
  allTickets,
  users,
  isEngLead,
  isDeveloper,
  onViewTicket,
}: TableLayoutProps) {
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Selection state
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Row actions
  const rowActions: RowAction<Ticket>[] = [
    {
      label: 'View Details',
      icon: <Icon name="eye" size="sm" />,
      onClick: (ticket) => onViewTicket(ticket),
    },
  ];

  // Bulk actions
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

  // Shared columns for Eng Lead and Developer
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
      title={isDeveloper ? 'No tickets assigned to you' : 'No tickets found'}
      message={
        isDeveloper
          ? "You don't have any assigned tickets at the moment"
          : 'No tickets match your current filters.'
      }
      className="min-h-0 py-12"
    />
  );

  const title = isDeveloper ? 'Assigned Tickets' : 'All Tickets';

  return (
    <div className="p-6">
      <h1 className="text-foreground mb-6 text-2xl font-bold">{title}</h1>

      {/* Summary Cards - Only for Eng Lead */}
      {isEngLead && allTickets && <SummaryCards tickets={allTickets} />}

      {/* Tickets Table */}
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
    </div>
  );
}

export default TicketList;
