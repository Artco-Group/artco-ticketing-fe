import EngLeadSidebar from './EngLeadSidebar';
import EngLeadSummaryCards from './EngLeadSummaryCards';
import EngLeadTicketTable from './EngLeadTicketTable';

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
  onAssignTicket,
}) {
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
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex flex-wrap items-center gap-4">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Status:
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => onFilterChange('status', e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
                >
                  <option value="All">All Status</option>
                  <option value="New">New</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Priority:
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) => onFilterChange('priority', e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
                >
                  <option value="All">All Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* Client Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Client:
                </label>
                <select
                  value={filters.client}
                  onChange={(e) => onFilterChange('client', e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
                >
                  <option value="All">All Clients</option>
                  {[...new Set(allTickets.map((t) => t.clientEmail))].map(
                    (client) => (
                      <option key={client} value={client}>
                        {client}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Assignee Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Assignee:
                </label>
                <select
                  value={filters.assignee}
                  onChange={(e) => onFilterChange('assignee', e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
                >
                  <option value="All">All Assignees</option>
                  <option value="Unassigned">Unassigned</option>
                  {users
                    .filter((u) => u.role === 'developer')
                    .map((dev) => (
                      <option key={dev._id} value={dev.email}>
                        {dev.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Sort by:
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => onFilterChange('sortBy', e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
                >
                  <option value="Status">Status</option>
                  <option value="Created Date">Created Date</option>
                  <option value="Priority">Priority</option>
                  <option value="Client">Client</option>
                  <option value="Assignee">Assignee</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tickets Table */}
          <EngLeadTicketTable
            tickets={tickets}
            users={users}
            onViewTicket={onViewTicket}
          />
        </main>
      </div>
    </div>
  );
}

export default EngLeadTicketList;
