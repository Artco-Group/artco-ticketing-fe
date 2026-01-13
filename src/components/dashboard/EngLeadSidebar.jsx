function EngLeadSidebar({
  userEmail,
  currentView,
  onLogout,
  onNavigateToTickets,
  onNavigateToUsers,
}) {
  return (
    <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
      {/* Company Logo */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#004179]">
            <span className="text-sm font-bold text-white">A</span>
          </div>
          <span className="font-semibold text-gray-900">Artco Group</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={onNavigateToTickets}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                currentView === 'tickets' || currentView === 'detail'
                  ? 'bg-[#004179] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <line x1="9" y1="12" x2="15" y2="12" />
                <line x1="9" y1="16" x2="13" y2="16" />
              </svg>
              All Tickets
            </button>
          </li>
          <li>
            <button
              onClick={onNavigateToUsers}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                currentView === 'users'
                  ? 'bg-[#004179] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
              User Management
            </button>
          </li>
        </ul>
      </nav>

      {/* User Info */}
      <div className="border-t border-gray-200 p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
            <span className="text-sm font-medium text-gray-600"></span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">
              {userEmail}
            </p>
            <p className="text-xs text-gray-500">Network Lead</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full text-left text-sm text-gray-600 transition-colors hover:text-gray-900"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default EngLeadSidebar;
