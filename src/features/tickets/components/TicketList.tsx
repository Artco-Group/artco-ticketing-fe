import { useState } from 'react';
import {
  UserRole,
  TicketPriority,
  type Ticket,
  type User,
  type Filters,
} from '@/types';
import {
  useRoleFlags,
  SummaryCards,
  FilterBar,
  type FilterConfig,
  DataTable,
  type Column,
  Button,
  EmptyState,
  Icon,
  Avatar,
  FilterPanel,
  type FilterPanelValues,
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

interface TicketListProps {
  tickets: Ticket[];
  allTickets?: Ticket[];
  users?: User[];
  filters?: Filters;
  userRole: UserRole;
  onViewTicket: (ticket: Ticket) => void;
  onFilterChange?: (field: string, value: string) => void;
  onCreateTicket?: () => void;
}

function TicketList({
  tickets,
  allTickets,
  users = [],
  filters,
  userRole,
  onViewTicket,
  onFilterChange,
  onCreateTicket,
}: TicketListProps) {
  const { isEngLead, isDeveloper, isClient } = useRoleFlags(userRole);

  // Client uses card layout
  if (isClient) {
    return (
      <ClientLayout
        tickets={tickets}
        onCreateTicket={onCreateTicket}
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
      filters={filters}
      isEngLead={isEngLead}
      isDeveloper={isDeveloper}
      onViewTicket={onViewTicket}
      onFilterChange={onFilterChange}
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

// Table layout for Eng Lead and Developer
interface TableLayoutProps {
  tickets: Ticket[];
  allTickets?: Ticket[];
  users: User[];
  filters?: Filters;
  isEngLead: boolean;
  isDeveloper: boolean;
  onViewTicket: (ticket: Ticket) => void;
  onFilterChange?: (field: string, value: string) => void;
}

function TableLayout({
  tickets,
  allTickets,
  users,
  filters,
  isEngLead,
  isDeveloper,
  onViewTicket,
  onFilterChange,
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

  // Filters for Eng Lead (3 filters - status, priority, sortBy)
  const engLeadFilters: FilterConfig[] = filters
    ? [
        {
          key: 'status',
          label: 'Status',
          value: filters.status,
          options: [
            { value: 'All', label: 'All Status' },
            { value: 'New', label: 'New' },
            { value: 'Open', label: 'Open' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Resolved', label: 'Resolved' },
            { value: 'Closed', label: 'Closed' },
          ],
        },
        {
          key: 'priority',
          label: 'Priority',
          value: filters.priority,
          options: [
            { value: 'All', label: 'All Priority' },
            { value: 'Low', label: 'Low' },
            { value: 'Medium', label: 'Medium' },
            { value: 'High', label: 'High' },
            { value: 'Critical', label: 'Critical' },
          ],
        },
        {
          key: 'sortBy',
          label: 'Sort by',
          value: filters.sortBy,
          options: [
            { value: 'Status', label: 'Status' },
            { value: 'Created Date', label: 'Created Date' },
            { value: 'Priority', label: 'Priority' },
            { value: 'Client', label: 'Client' },
            { value: 'Assignee', label: 'Assignee' },
          ],
        },
      ]
    : [];

  // FilterPanel groups for Eng Lead (assignee and client)
  const filterPanelGroups = [
    {
      key: 'assignee',
      label: 'Assignee',
      searchable: true,
      options: [
        { value: 'Unassigned', label: 'Unassigned' },
        ...users
          .filter((u) => u.role === UserRole.DEVELOPER)
          .map((dev) => ({
            value: dev.email || '',
            label: dev.name || dev.email || '',
          })),
      ],
    },
    {
      key: 'client',
      label: 'Client',
      searchable: true,
      options: [
        ...new Set(
          (allTickets || tickets)
            .map((t) => t.clientEmail)
            .filter((e): e is string => !!e)
        ),
      ].map((client) => ({
        value: client,
        label: client,
      })),
    },
  ];

  // Handle FilterPanel changes (multi-select - comma-separated values)
  const handleFilterPanelChange = (values: FilterPanelValues) => {
    if (onFilterChange) {
      // Convert arrays to comma-separated strings, or 'All' if empty
      const newAssignee =
        values.assignee && values.assignee.length > 0
          ? values.assignee.join(',')
          : 'All';
      const newClient =
        values.client && values.client.length > 0
          ? values.client.join(',')
          : 'All';

      const currentAssignee = filters?.assignee || 'All';
      const currentClient = filters?.client || 'All';

      // Update whichever filter changed
      if (newAssignee !== currentAssignee) {
        onFilterChange('assignee', newAssignee);
      } else if (newClient !== currentClient) {
        onFilterChange('client', newClient);
      }
    }
  };

  // Convert current filters to FilterPanel values for controlled state
  // Parse comma-separated URL values back into arrays
  const filterPanelValue: FilterPanelValues = {
    ...(filters?.assignee && filters.assignee !== 'All'
      ? { assignee: filters.assignee.split(',') }
      : {}),
    ...(filters?.client && filters.client !== 'All'
      ? { client: filters.client.split(',') }
      : {}),
  };

  // Filters for Developer (3 filters)
  const developerFilters: FilterConfig[] = filters
    ? [
        {
          key: 'status',
          label: 'Status',
          value: filters.status,
          options: [
            { value: 'All', label: 'All Status' },
            { value: 'New', label: 'New' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Resolved', label: 'Resolved' },
          ],
        },
        {
          key: 'priority',
          label: 'Priority',
          value: filters.priority,
          options: [
            { value: 'All', label: 'All Priority' },
            { value: 'Low', label: 'Low' },
            { value: 'Medium', label: 'Medium' },
            { value: 'High', label: 'High' },
            { value: 'Critical', label: 'Critical' },
          ],
        },
        {
          key: 'sortBy',
          label: 'Sort by',
          value: filters.sortBy,
          options: [
            { value: 'Created Date', label: 'Created Date' },
            { value: 'Priority', label: 'Priority' },
            { value: 'Status', label: 'Status' },
          ],
        },
      ]
    : [];

  const filterConfig = isEngLead ? engLeadFilters : developerFilters;

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

      {/* Filters Section */}
      {filters && onFilterChange && filterConfig.length > 0 && (
        <FilterBar
          filters={filterConfig}
          onFilterChange={onFilterChange}
          className="mb-6"
        >
          {isEngLead && (
            <FilterPanel
              label="Filter"
              groups={filterPanelGroups}
              value={filterPanelValue}
              onChange={handleFilterPanelChange}
            />
          )}
        </FilterBar>
      )}

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
