import type { FormEvent } from 'react';
import { useState } from 'react';
import type { User } from '@/types';
import { UserRole } from '@/types';
import Sidebar from '@/shared/components/layout/Sidebar';
import Table from '@/shared/components/ui/Table';
import FilterBar, {
  type FilterConfig,
} from '@/shared/components/common/FilterBar';
import {
  textColumn,
  badgeColumn,
  dateColumn,
  actionsColumn,
} from '@/shared/components/ui/tableColumns';

interface UserFormData {
  name: string;
  email: string;
  role: string;
  password?: string;
}

interface EngLeadUserManagementProps {
  users: User[];
  userEmail: string;
  onLogout: () => void;
  onNavigateToTickets: () => void;
  onUserAction: (
    action: 'add' | 'edit' | 'delete',
    userId: string | null,
    data?: UserFormData
  ) => void;
}

function EngLeadUserManagement({
  users,
  userEmail,
  onLogout,
  onNavigateToTickets,
  onUserAction,
}: EngLeadUserManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'client',
  });

  const roles: UserRole[] = [
    UserRole.Client,
    UserRole.Developer,
    UserRole.EngLead,
  ];
  const roleColors: Record<string, string> = {
    client: 'bg-blue-100 text-blue-800',
    developer: 'bg-green-100 text-green-800',
    eng_lead: 'bg-purple-100 text-purple-800',
    admin: 'bg-red-100 text-red-800',
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'client' });
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'client',
    });
    setShowModal(true);
  };

  const handleSaveUser = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.role) {
      alert('Please fill in all required fields.');
      return;
    }

    if (editingUser) {
      onUserAction('edit', editingUser._id || editingUser.id || null, formData);
    } else {
      // Set default password for new users
      onUserAction('add', null, { ...formData, password: 'p455w0rd' });
    }

    setShowModal(false);
    setFormData({ name: '', email: '', role: 'client' });
  };

  const handleDeleteUser = (user: User) => {
    onUserAction('delete', user._id || user.id || null);
    setShowDeleteModal(null);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const EditIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );

  const DeleteIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );

  const columns = [
    textColumn<User>('name', 'Name', {
      className: 'font-medium text-gray-900',
    }),
    textColumn<User>('email', 'Email', {
      className: 'text-sm text-gray-900',
    }),
    badgeColumn<User>(
      'role',
      'Role',
      (role) => roleColors[role] || 'bg-gray-100 text-gray-800'
    ),
    dateColumn<User>('createdAt', 'Created', formatDate, {
      className: 'text-gray-500',
    }),
    actionsColumn<User>('actions', 'Actions', [
      {
        icon: EditIcon,
        onClick: handleEditUser,
        label: 'Edit user',
        className: 'p-1.5 text-gray-400 transition-colors hover:text-[#004179]',
      },
      {
        icon: DeleteIcon,
        onClick: setShowDeleteModal,
        label: 'Delete user',
        className: 'p-1.5 text-gray-400 transition-colors hover:text-red-600',
      },
    ]),
  ];

  const filterConfig: FilterConfig[] = [
    {
      key: 'role',
      label: 'Role',
      type: 'select' as const,
      value: roleFilter,
      options: [
        { value: 'All', label: 'All Roles' },
        ...roles.map((role) => ({ value: role, label: role })),
      ],
    },
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
          d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
      <p className="mt-1 text-sm text-gray-500">
        No users match your current search and filters.
      </p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        userEmail={userEmail}
        currentView="users"
        onLogout={onLogout}
        onNavigateToTickets={onNavigateToTickets}
        onNavigateToUsers={() => {}}
      />

      <div className="flex flex-1 flex-col">
        {/* Page Header */}
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <nav className="mb-1 text-sm text-gray-500">User Management</nav>
              <h1 className="text-2xl font-bold text-gray-900">
                User Management
              </h1>
            </div>
            <button
              onClick={handleAddUser}
              className="rounded-lg bg-[#004179] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#003366]"
            >
              Add New User
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          {/* Search & Filters */}
          <FilterBar
            filters={filterConfig}
            searchConfig={{
              placeholder: 'Search by name or email',
              value: searchTerm,
              onChange: setSearchTerm,
            }}
            onFilterChange={(key, value) => {
              if (key === 'role') {
                setRoleFilter(value);
              }
            }}
            className="mb-6"
          />

          {/* Users Table */}
          <Table
            columns={columns}
            data={filteredUsers}
            emptyState={emptyState}
          />
        </main>
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
                  required
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#004179] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#003366]"
                >
                  {editingUser ? 'Save Changes' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Delete User
            </h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete {showDeleteModal.name}? This
              action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteModal)}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EngLeadUserManagement;
