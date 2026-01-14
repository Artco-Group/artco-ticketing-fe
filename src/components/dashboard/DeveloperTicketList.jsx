import DashboardHeader from '../shared/DashboardHeader';
import FilterBar from '../shared/FilterBar';
import Table from '../shared/Table';
import {
  statusColors,
  priorityConfig,
  categoryColors,
  formatDate,
  formatDateTime,
} from '../../utils/ticketHelpers';
import {
  textColumn,
  customColumn,
  badgeColumn,
  dateColumn,
} from '../shared/tableColumns.jsx';

function DeveloperTicketList({
  tickets,
  userEmail,
  filters,
  onLogout,
  onViewTicket,
  onFilterChange,
}) {
  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
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
      type: 'select',
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
      type: 'select',
      value: filters.sortBy,
      options: [
        { value: 'Created Date', label: 'Created Date' },
        { value: 'Priority', label: 'Priority' },
        { value: 'Status', label: 'Status' },
      ],
    },
  ];

  const columns = [
    customColumn('title', 'Title', (ticket) => (
      <div className="line-clamp-2 font-semibold text-gray-900">
        {ticket.title}
      </div>
    )),
    textColumn('ticketId', 'Ticket ID', {
      className: 'text-sm text-gray-500',
    }),
    textColumn('clientEmail', 'Client', {
      className: 'text-sm text-gray-600',
    }),
    badgeColumn(
      'category',
      'Category',
      (category) =>
        categoryColors[category] || 'bg-gray-100 text-gray-800 border-gray-200'
    ),
    customColumn('priority', 'Priority', (ticket) => (
      <span
        className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium ${priorityConfig[ticket.priority].bg} ${priorityConfig[ticket.priority].color}`}
      >
        {priorityConfig[ticket.priority].label}
      </span>
    )),
    badgeColumn(
      'status',
      'Status',
      (status) =>
        statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
    ),
    dateColumn('createdAt', 'Created', formatDate, {
      className: 'text-gray-600',
    }),
    customColumn('lastUpdated', 'Last Updated', (ticket) => (
      <div className="text-sm text-gray-600">
        {formatDateTime(ticket.lastUpdated || ticket.createdAt)}
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
      <DashboardHeader
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
