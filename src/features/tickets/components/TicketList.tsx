import {
  formatDateLocalized,
  formatDateTime,
} from '@artco-group/artco-ticketing-sync';
import { UserRole, type Ticket, type User, type Filters } from '@/types';
import {
  useRoleFlags,
  SummaryCards,
  FilterBar,
  type FilterConfig,
  DataTable,
  textColumn,
  customColumn,
  badgeColumn,
  dateColumn,
  Button,
  Badge,
  EmptyState,
  Icon,
} from '@/shared';
import {
  statusColors,
  priorityConfig,
  categoryColors,
  resolveAssigneeName,
} from '@/shared/utils/ticket-helpers';
import { cn } from '@/lib/utils';
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
      <div className="flex-between mb-6">
        <h1 className="text-foreground text-2xl font-bold">My Tickets</h1>
        {onCreateTicket && (
          <Button onClick={onCreateTicket}>
            <Icon name="plus" size="lg" className="mr-2" />
            Create New Ticket
          </Button>
        )}
      </div>

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
      title="No tickets yet"
      message="Create your first support ticket to get started"
      action={
        onCreateTicket && (
          <Button onClick={onCreateTicket} size="lg">
            <Icon name="plus" size="lg" className="mr-2" />
            Create New Ticket
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
  // Columns for Eng Lead (includes assignedTo column)
  const engLeadColumns = [
    customColumn<Ticket>('title', 'Title', (ticket) => (
      <div className="text-foreground font-semibold">{ticket.title}</div>
    )),
    textColumn<Ticket>('ticketId', 'Ticket ID', {
      className: 'text-sm text-muted-foreground',
    }),
    textColumn<Ticket>('clientEmail', 'Client', {
      className: 'text-sm text-foreground',
    }),
    badgeColumn<Ticket>(
      'category',
      'Category',
      (category) =>
        categoryColors[category] || 'bg-secondary text-secondary-foreground'
    ),
    customColumn<Ticket>('priority', 'Priority', (ticket) => (
      <Badge
        variant="secondary"
        className={cn(
          priorityConfig[ticket.priority].bg,
          priorityConfig[ticket.priority].color
        )}
      >
        {priorityConfig[ticket.priority].label}
      </Badge>
    )),
    badgeColumn<Ticket>(
      'status',
      'Status',
      (status) =>
        statusColors[status] || 'bg-secondary text-secondary-foreground'
    ),
    customColumn<Ticket>('assignedTo', 'Assigned To', (ticket) => (
      <div className="text-foreground text-sm">
        {ticket.assignedTo ? (
          resolveAssigneeName(ticket.assignedTo, users)
        ) : (
          <Badge
            variant="outline"
            className="border-orange-200 text-orange-600"
          >
            Unassigned
          </Badge>
        )}
      </div>
    )),
    dateColumn<Ticket>('createdAt', 'Created', formatDateLocalized, {
      className: 'text-muted-foreground',
    }),
  ];

  // Columns for Developer (includes lastUpdated column)
  const developerColumns = [
    customColumn<Ticket>('title', 'Title', (ticket) => (
      <div className="text-foreground line-clamp-2 font-semibold">
        {ticket.title}
      </div>
    )),
    textColumn<Ticket>('ticketId', 'Ticket ID', {
      className: 'text-sm text-muted-foreground',
    }),
    textColumn<Ticket>('clientEmail', 'Client', {
      className: 'text-sm text-muted-foreground',
    }),
    badgeColumn<Ticket>(
      'category',
      'Category',
      (category) =>
        categoryColors[category] || 'bg-secondary text-secondary-foreground'
    ),
    customColumn<Ticket>('priority', 'Priority', (ticket) => (
      <Badge
        variant="secondary"
        className={cn(
          priorityConfig[ticket.priority].bg,
          priorityConfig[ticket.priority].color
        )}
      >
        {priorityConfig[ticket.priority].label}
      </Badge>
    )),
    badgeColumn<Ticket>(
      'status',
      'Status',
      (status) =>
        statusColors[status] || 'bg-secondary text-secondary-foreground'
    ),
    dateColumn<Ticket>('createdAt', 'Created', formatDateLocalized, {
      className: 'text-muted-foreground',
    }),
    customColumn<Ticket>('lastUpdated', 'Last Updated', (ticket) => (
      <div className="text-muted-sm">
        {formatDateTime(ticket.lastUpdated || ticket.createdAt || '')}
      </div>
    )),
  ];

  const columns = isEngLead ? engLeadColumns : developerColumns;

  // Filters for Eng Lead (5 filters)
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
          key: 'client',
          label: 'Client',
          value: filters.client,
          options: [
            { value: 'All', label: 'All Clients' },
            ...[
              ...new Set(
                (allTickets || tickets)
                  .map((t) => t.clientEmail)
                  .filter((e): e is string => !!e)
              ),
            ].map((client) => ({
              value: client,
              label: client,
            })),
          ],
        },
        {
          key: 'assignee',
          label: 'Assignee',
          value: filters.assignee,
          options: [
            { value: 'All', label: 'All Assignees' },
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
        />
      )}

      {/* Tickets Table */}
      <DataTable
        columns={columns}
        data={tickets}
        onRowClick={onViewTicket}
        emptyState={emptyState}
      />
    </div>
  );
}

export default TicketList;
