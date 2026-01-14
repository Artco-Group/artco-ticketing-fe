import EngLeadSidebar from '../shared/EngLeadSidebar';
import EngLeadSummaryCards from '../shared/EngLeadSummaryCards';
import FilterBar from '../shared/FilterBar';
import Table from '../shared/Table';
import {
  statusColors,
  priorityConfig,
  categoryColors,
} from '../../utils/ticketHelpers';
import {
  textColumn,
  customColumn,
  badgeColumn,
  dateColumn,
} from '../shared/tableColumns.jsx';

function EngLeadTicketList({
  tickets,
  allTickets,
  users,
  userEmail,
  filters,
  onLogout,
  onViewTicket,
  onNavigateToUsers,
  onFilterChange,
}) {
  const getAssigneeName = (assignedTo) => {
    const user = users.find((u) => u.email === assignedTo.email);
    return user ? user.name : assignedTo.email;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const columns = [
    customColumn('title', 'Title', (ticket) => (
      <div className="font-semibold text-gray-900">{ticket.title}</div>
    )),
    textColumn('ticketId', 'Ticket ID', {
      className: 'text-sm text-gray-500',
    }),
    textColumn('clientEmail', 'Client', {
      className: 'text-sm text-gray-900',
    }),
    badgeColumn(
      'category',
      'Category',
      (category) =>
        categoryColors[category] || 'bg-gray-100 text-gray-800 border-gray-200'
    ),
    customColumn('priority', 'Priority', (ticket) => (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityConfig[ticket.priority].bg} ${priorityConfig[ticket.priority].color}`}
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
    customColumn('assignedTo', 'Assigned To', (ticket) => (
      <div className="text-sm text-gray-900">
        {ticket.assignedTo ? (
          getAssigneeName(ticket.assignedTo)
        ) : (
          <span className="font-medium text-orange-600">Unassigned</span>
        )}
      </div>
    )),
    dateColumn('createdAt', 'Created', formatDate, {
      className: 'text-gray-500',
    }),
  ];

  const emptyState = (
    <div className="py-12 text-center">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        No tickets found
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        No tickets match your current filters.
      </p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <EngLeadSidebar
        userEmail={userEmail}
        currentView="tickets"
        onLogout={onLogout}
        onNavigateToTickets={() => {}}
        onNavigateToUsers={onNavigateToUsers}
      />

      <div className="flex flex-1 flex-col">
        {/* Page Header */}
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">All Tickets</h1>
        </header>

        <main className="flex-1 p-6">
          {/* Summary Cards */}
          <EngLeadSummaryCards tickets={allTickets} />

          {/* Filters Section */}
          <FilterBar
            filters={[
              {
                key: 'status',
                label: 'Status',
                type: 'select',
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
                key: 'client',
                label: 'Client',
                type: 'select',
                value: filters.client,
                options: [
                  { value: 'All', label: 'All Clients' },
                  ...[...new Set(allTickets.map((t) => t.clientEmail))].map(
                    (client) => ({
                      value: client,
                      label: client,
                    })
                  ),
                ],
              },
              {
                key: 'assignee',
                label: 'Assignee',
                type: 'select',
                value: filters.assignee,
                options: [
                  { value: 'All', label: 'All Assignees' },
                  { value: 'Unassigned', label: 'Unassigned' },
                  ...users
                    .filter((u) => u.role === 'developer')
                    .map((dev) => ({
                      value: dev.email,
                      label: dev.name,
                    })),
                ],
              },
              {
                key: 'sortBy',
                label: 'Sort by',
                type: 'select',
                value: filters.sortBy,
                options: [
                  { value: 'Status', label: 'Status' },
                  { value: 'Created Date', label: 'Created Date' },
                  { value: 'Priority', label: 'Priority' },
                  { value: 'Client', label: 'Client' },
                  { value: 'Assignee', label: 'Assignee' },
                ],
              },
            ]}
            onFilterChange={onFilterChange}
            className="mb-6"
          />

          {/* Tickets Table */}
          <Table
            columns={columns}
            data={tickets}
            onRowClick={onViewTicket}
            emptyState={emptyState}
          />
        </main>
      </div>
    </div>
  );
}

export default EngLeadTicketList;
