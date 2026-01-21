import type { Ticket } from '@artco-group/artco-ticketing-sync/types';
import type { Filters } from '@/types';
import FilterBar, {
  type FilterConfig,
} from '@/shared/components/common/FilterBar';
import Table from '@/shared/components/ui/Table';
import {
  statusColors,
  priorityConfig,
  categoryColors,
} from '@/shared/utils/ticket-helpers';
import {
  formatDateLocalized,
  formatDateTime,
} from '@artco-group/artco-ticketing-sync/utils';
import {
  textColumn,
  customColumn,
  badgeColumn,
  dateColumn,
} from '@/shared/components/ui/tableColumns';
import PageHeader from '@/shared/components/layout/PageHeader';

interface DeveloperTicketListProps {
  tickets: Ticket[];
  userEmail: string;
  filters: Filters;
  onLogout: () => void;
  onViewTicket: (ticket: Ticket) => void;
  onFilterChange: (field: string, value: string) => void;
}

function DeveloperTicketList({
  tickets,
  userEmail,
  filters,
  onLogout,
  onViewTicket,
  onFilterChange,
}: DeveloperTicketListProps) {
  const filterConfig: FilterConfig[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
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
      type: 'select' as const,
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
      type: 'select' as const,
      value: filters.sortBy,
      options: [
        { value: 'Created Date', label: 'Created Date' },
        { value: 'Priority', label: 'Priority' },
        { value: 'Status', label: 'Status' },
      ],
    },
  ];

  const columns = [
    customColumn<Ticket>('title', 'Title', (ticket) => (
      <div className="line-clamp-2 font-semibold text-gray-900">
        {ticket.title}
      </div>
    )),
    textColumn<Ticket>('ticketId', 'Ticket ID', {
      className: 'text-sm text-gray-500',
    }),
    textColumn<Ticket>('clientEmail', 'Client', {
      className: 'text-sm text-gray-600',
    }),
    badgeColumn<Ticket>(
      'category',
      'Category',
      (category) =>
        categoryColors[category] || 'bg-gray-100 text-gray-800 border-gray-200'
    ),
    customColumn<Ticket>('priority', 'Priority', (ticket) => (
      <span
        className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium ${priorityConfig[ticket.priority].bg} ${priorityConfig[ticket.priority].color}`}
      >
        {priorityConfig[ticket.priority].label}
      </span>
    )),
    badgeColumn<Ticket>(
      'status',
      'Status',
      (status) =>
        statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
    ),
    dateColumn<Ticket>('createdAt', 'Created', formatDateLocalized, {
      className: 'text-gray-600',
    }),
    customColumn<Ticket>('lastUpdated', 'Last Updated', (ticket) => (
      <div className="text-sm text-gray-600">
        {formatDateTime(ticket.lastUpdated || ticket.createdAt || '')}
      </div>
    )),
  ];

  const emptyState = (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9ca3af"
          strokeWidth="1.5"
        >
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="1" />
          <line x1="9" y1="12" x2="15" y2="12" />
          <line x1="9" y1="16" x2="13" y2="16" />
        </svg>
      </div>
      <h2 className="mb-2 text-xl font-semibold text-gray-900">
        No tickets assigned to you
      </h2>
      <p className="text-gray-500">
        You don't have any assigned tickets at the moment
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Assigned Tickets"
        userEmail={userEmail}
        onLogout={onLogout}
      />

      {/* Filters Section */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <FilterBar filters={filterConfig} onFilterChange={onFilterChange} />
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Table
          columns={columns}
          data={tickets}
          onRowClick={onViewTicket}
          emptyState={emptyState}
        />
      </main>
    </div>
  );
}

export default DeveloperTicketList;
