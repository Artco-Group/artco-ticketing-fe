import DashboardHeader from './DashboardHeader';
import DeveloperTicketTable from './DeveloperTicketTable';

function DeveloperTicketList({
  tickets,
  userEmail,
  filters,
  onLogout,
  onViewTicket,
  onFilterChange,
}) {
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
          <div className="flex items-center gap-4">
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
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
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
                <option value="Created Date">Created Date</option>
                <option value="Priority">Priority</option>
                <option value="Status">Status</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <DeveloperTicketTable tickets={tickets} onViewTicket={onViewTicket} />
      </main>
    </div>
  );
}

export default DeveloperTicketList;
