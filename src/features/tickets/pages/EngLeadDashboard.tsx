import type { FormEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { Ticket, Comment, User, Filters } from '@/types';
import type { AxiosError } from 'axios';

import { EngLeadTicketList, EngLeadTicketDetail } from '../components';
import { UserManagement as EngLeadUserManagement } from '@/features/users/components';

import { useAuth } from '@/features/auth/context';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { usersAPI } from '@/features/users/api';
import { ticketAPI } from '../api/tickets-api';
import { commentAPI } from '../api/comments-api';

interface ApiErrorResponse {
  message?: string;
}

interface UserFormData {
  email?: string;
  name?: string;
  role?: string;
  password?: string;
}

type ViewState = 'tickets' | 'detail' | 'users';

function EngLeadDashboard() {
  const [currentView, setCurrentView] = useState<ViewState>('tickets');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [, setTicketsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [, setUsersLoading] = useState(true);
  const [, setUsersError] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [filters, setFilters] = useState<Filters>({
    status: 'All',
    priority: 'All',
    client: 'All',
    assignee: 'All',
    sortBy: 'Status',
  });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingTicket, setPendingTicket] = useState<Ticket | null>(null);

  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Comment state
  const [newComment, setNewComment] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch tickets from API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setTicketsLoading(true);
        const response = await ticketAPI.getTickets();
        setTickets(response.data);
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
      } finally {
        setTicketsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        setUsersError(null);
        const response = await usersAPI.getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        const axiosError = error as AxiosError<ApiErrorResponse>;
        setUsersError(
          axiosError.response?.data?.message || 'Failed to load users'
        );
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Initialize filters from URL params on mount
  useEffect(() => {
    const urlFilters = {
      status: searchParams.get('status') || 'All',
      priority: searchParams.get('priority') || 'All',
      client: searchParams.get('client') || 'All',
      assignee: searchParams.get('assignee') || 'All',
      sortBy: searchParams.get('sortBy') || 'Status',
    };
    setFilters(urlFilters);
  }, [searchParams]);

  // Open ticket from URL param if present
  useEffect(() => {
    const ticketId = searchParams.get('ticket');
    if (ticketId && tickets.length > 0 && !selectedTicket) {
      const ticket = tickets.find((t) => t._id === ticketId);
      if (ticket) {
        // Ticket found in user's accessible list - open it
        openTicketDetail(ticket);
      } else {
        // Ticket NOT in user's list = user has no permission
        // Clear the invalid param silently
        searchParams.delete('ticket');
        setSearchParams(searchParams);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, tickets, selectedTicket]);

  useEffect(() => {
    // GSAP animations on mount
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dashboard-header',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
      gsap.fromTo(
        '.ticket-row, .summary-card',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.2,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [currentView]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleViewTicket = async (ticket: Ticket) => {
    // Auto-transition New -> Open with confirmation
    if (ticket.status === 'New') {
      setPendingTicket(ticket);
      setShowStatusModal(true);
    } else {
      // Directly open ticket if not "New" status
      await openTicketDetail(ticket);
    }
  };

  const openTicketDetail = async (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setCurrentView('detail');

    // Update URL with ticket param
    setSearchParams({
      ...Object.fromEntries(searchParams),
      ticket: ticket._id || '',
    });

    // Fetch comments for this ticket
    try {
      const response = await commentAPI.getComments(ticket._id || '');
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      setComments([]);
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!pendingTicket) return;

    try {
      const response = await ticketAPI.updateTicketStatus(
        pendingTicket._id || '',
        'Open'
      );
      const updatedTicket = response.data;
      setTickets((prev) =>
        prev.map((t) => (t._id === pendingTicket._id ? updatedTicket : t))
      );
      setShowStatusModal(false);
      setPendingTicket(null);
      // Open ticket detail with updated ticket
      await openTicketDetail(updatedTicket);
      toast.success('Ticket status updated successfully');
    } catch (error) {
      console.error('Failed to update ticket status:', error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast.error(
        axiosError.response?.data?.message || 'Failed to update status'
      );
      setShowStatusModal(false);
      setPendingTicket(null);
    }
  };

  const handleCancelStatusChange = () => {
    setShowStatusModal(false);
    setPendingTicket(null);
    // Stay in ticket list - don't open detail
  };

  const handleBackToList = () => {
    setCurrentView('tickets');
    setSelectedTicket(null);
    setComments([]);

    // Remove ticket param from URL
    searchParams.delete('ticket');
    setSearchParams(searchParams);
  };

  const handleNavigateToUsers = () => {
    setCurrentView('users');
  };

  const handleNavigateToTickets = () => {
    setCurrentView('tickets');
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);

    // Build query params (omit "All" values)
    const params: Record<string, string> = {};
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val !== 'All') {
        params[key] = val;
      }
    });

    // Preserve ticket param if present
    const ticketId = searchParams.get('ticket');
    if (ticketId) {
      params.ticket = ticketId;
    }

    setSearchParams(params);
  };

  const handleAssignTicket = async (ticketId: string, developerId: string) => {
    try {
      const response = await ticketAPI.updateTicketAssignee(
        ticketId,
        developerId
      );
      const updatedTicket = response.data;

      setTickets((prev) =>
        prev.map((ticket) => (ticket._id === ticketId ? updatedTicket : ticket))
      );

      if (selectedTicket && selectedTicket._id === ticketId) {
        setSelectedTicket(updatedTicket);
      }
      toast.success('Ticket assigned successfully');
    } catch (error) {
      console.error('Failed to assign ticket:', error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast.error(
        axiosError.response?.data?.message || 'Failed to assign ticket'
      );
    }
  };

  const handleStatusUpdate = async (ticketId: string, newStatus: string) => {
    try {
      const response = await ticketAPI.updateTicketStatus(ticketId, newStatus);
      const updatedTicket = response.data;

      setTickets((prev) =>
        prev.map((ticket) => (ticket._id === ticketId ? updatedTicket : ticket))
      );

      if (selectedTicket && selectedTicket._id === ticketId) {
        setSelectedTicket(updatedTicket);
      }
      toast.success('Ticket status updated successfully');
    } catch (error) {
      console.error('Failed to update ticket status:', error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast.error(
        axiosError.response?.data?.message || 'Failed to update status'
      );
    }
  };

  const handlePriorityUpdate = async (
    ticketId: string,
    newPriority: string
  ) => {
    try {
      const response = await ticketAPI.updateTicketPriority(
        ticketId,
        newPriority
      );
      const updatedTicket = response.data;

      setTickets((prev) =>
        prev.map((ticket) => (ticket._id === ticketId ? updatedTicket : ticket))
      );

      if (selectedTicket && selectedTicket._id === ticketId) {
        setSelectedTicket(updatedTicket);
      }
      toast.success('Ticket priority updated successfully');
    } catch (error) {
      console.error('Failed to update ticket priority:', error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast.error(
        axiosError.response?.data?.message || 'Failed to update priority'
      );
    }
  };

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedTicket) return;

    try {
      const response = await commentAPI.addComment(selectedTicket._id || '', {
        text: newComment,
      });
      // Add the new comment to the comments list
      setComments((prev) => [...prev, response.data]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Failed to add comment:', error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast.error(
        axiosError.response?.data?.message || 'Failed to add comment'
      );
    }
  };

  const handleUserAction = async (
    action: 'add' | 'edit' | 'delete',
    userId: string | null,
    userData?: UserFormData
  ) => {
    switch (action) {
      case 'add':
        try {
          const response = await usersAPI.createUser(userData || {});
          setUsers((prev) => [...prev, response.data]);
          toast.success('User created successfully');
        } catch (error) {
          console.error('Failed to create user:', error);
          const axiosError = error as AxiosError<ApiErrorResponse>;
          toast.error(
            axiosError.response?.data?.message || 'Failed to create user'
          );
        }
        break;
      case 'edit':
        try {
          const response = await usersAPI.updateUser(
            userId || '',
            userData || {}
          );
          setUsers((prev) =>
            prev.map((u) => (u._id === userId ? { ...u, ...response.data } : u))
          );
          toast.success('User updated successfully');
        } catch (error) {
          console.error('Failed to update user:', error);
          const axiosError = error as AxiosError<ApiErrorResponse>;
          toast.error(
            axiosError.response?.data?.message || 'Failed to update user'
          );
        }

        break;
      case 'delete':
        try {
          await usersAPI.deleteUser(userId || '');
          setUsers((prev) => prev.filter((u) => u._id !== userId));
          toast.success('User deleted successfully');
        } catch (error) {
          console.error('Failed to delete user:', error);
          const axiosError = error as AxiosError<ApiErrorResponse>;
          toast.error(
            axiosError.response?.data?.message || 'Failed to delete user'
          );
        }
        break;
      default:
        break;
    }
  };

  // Filter and sort tickets
  const filteredTickets = tickets
    .filter((ticket) => {
      if (filters.status !== 'All' && ticket.status !== filters.status)
        return false;
      if (filters.priority !== 'All' && ticket.priority !== filters.priority)
        return false;
      if (filters.client !== 'All' && ticket.clientEmail !== filters.client)
        return false;
      if (filters.assignee !== 'All') {
        if (filters.assignee === 'Unassigned' && ticket.assignedTo)
          return false;
        if (filters.assignee !== 'Unassigned') {
          const assigneeEmail =
            typeof ticket.assignedTo === 'string'
              ? ticket.assignedTo
              : ticket.assignedTo?.email;
          if (assigneeEmail !== filters.assignee) return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'Status': {
          const statusOrder = {
            New: 1,
            Open: 2,
            'In Progress': 3,
            Resolved: 4,
            Closed: 5,
          };
          return statusOrder[a.status] - statusOrder[b.status];
        }
        case 'Priority': {
          const priorityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        case 'Client':
          return (a.clientEmail || '').localeCompare(b.clientEmail || '');
        case 'Assignee': {
          const aName =
            typeof a.assignedTo === 'string'
              ? a.assignedTo
              : a.assignedTo?.name || 'Unassigned';
          const bName =
            typeof b.assignedTo === 'string'
              ? b.assignedTo
              : b.assignedTo?.name || 'Unassigned';
          return aName.localeCompare(bName);
        }
        case 'Created Date':
        default:
          return (
            new Date(b.createdAt || '').getTime() -
            new Date(a.createdAt || '').getTime()
          );
      }
    });

  return (
    <div ref={containerRef}>
      {currentView === 'tickets' && (
        <EngLeadTicketList
          tickets={filteredTickets}
          allTickets={tickets}
          users={users}
          userEmail={user?.email || ''}
          filters={filters}
          onLogout={handleLogout}
          onViewTicket={handleViewTicket}
          onNavigateToUsers={handleNavigateToUsers}
          onFilterChange={handleFilterChange}
        />
      )}
      {currentView === 'detail' && selectedTicket && (
        <EngLeadTicketDetail
          ticket={selectedTicket}
          comments={comments}
          users={users}
          userEmail={user?.email || ''}
          onLogout={handleLogout}
          onBack={handleBackToList}
          onNavigateToUsers={handleNavigateToUsers}
          onAssignTicket={handleAssignTicket}
          onStatusUpdate={handleStatusUpdate}
          onPriorityUpdate={handlePriorityUpdate}
          newComment={newComment}
          onCommentChange={setNewComment}
          onAddComment={handleAddComment}
          currentUser={user}
        />
      )}
      {currentView === 'users' && (
        <EngLeadUserManagement
          users={users}
          userEmail={user?.email || ''}
          onLogout={handleLogout}
          onNavigateToTickets={handleNavigateToTickets}
          onUserAction={handleUserAction}
        />
      )}

      {/* Status Change Confirmation Modal */}
      {showStatusModal && pendingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Change Ticket Status
            </h3>
            <p className="mb-6 text-gray-600">
              This ticket will be marked as Open. Do you want to continue?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancelStatusChange}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusChange}
                className="flex-1 rounded-lg bg-[#004179] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#003366]"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EngLeadDashboard;
