import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

import {
  EngLeadTicketList,
  EngLeadTicketDetail,
  EngLeadUserManagement,
} from '../components/dashboard';

import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usersAPI } from '../services/usersApi';
import { ticketAPI } from '../services/ticketApi';
import { commentAPI } from '../services/commentApi';

function EngLeadDashboard() {
  const [currentView, setCurrentView] = useState('tickets'); // 'tickets', 'detail', 'users'
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [_ticketsLoading, setTicketsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [_usersLoading, setUsersLoading] = useState(true);
  const [_usersError, setUsersError] = useState(null);
  const [comments, setComments] = useState([]);
  const [filters, setFilters] = useState({
    status: 'All',
    priority: 'All',
    client: 'All',
    assignee: 'All',
    sortBy: 'Status',
  });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingTicket, setPendingTicket] = useState(null);

  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Comment state
  const [newComment, setNewComment] = useState('');

  const containerRef = useRef(null);

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
        setUsersError(error.response?.data?.message || 'Failed to load users');
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

  const handleViewTicket = async (ticket) => {
    // Auto-transition New -> Open with confirmation
    if (ticket.status === 'New') {
      setPendingTicket(ticket);
      setShowStatusModal(true);
    } else {
      // Directly open ticket if not "New" status
      await openTicketDetail(ticket);
    }
  };

  const openTicketDetail = async (ticket) => {
    setSelectedTicket(ticket);
    setCurrentView('detail');

    // Update URL with ticket param
    setSearchParams({
      ...Object.fromEntries(searchParams),
      ticket: ticket._id,
    });

    // Fetch comments for this ticket
    try {
      const response = await commentAPI.getComments(ticket._id);
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
        pendingTicket._id,
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
    } catch (error) {
      console.error('Failed to update ticket status:', error);
      alert(error.response?.data?.message || 'Failed to update status');
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

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);

    // Build query params (omit "All" values)
    const params = {};
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

  const handleAssignTicket = async (ticketId, developerId) => {
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
    } catch (error) {
      console.error('Failed to assign ticket:', error);
      alert(error.response?.data?.message || 'Failed to assign ticket');
    }
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      const response = await ticketAPI.updateTicketStatus(ticketId, newStatus);
      const updatedTicket = response.data;

      setTickets((prev) =>
        prev.map((ticket) => (ticket._id === ticketId ? updatedTicket : ticket))
      );

      if (selectedTicket && selectedTicket._id === ticketId) {
        setSelectedTicket(updatedTicket);
      }
    } catch (error) {
      console.error('Failed to update ticket status:', error);
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handlePriorityUpdate = async (ticketId, newPriority) => {
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
    } catch (error) {
      console.error('Failed to update ticket priority:', error);
      alert(error.response?.data?.message || 'Failed to update priority');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await commentAPI.addComment(selectedTicket._id, {
        text: newComment,
      });
      // Add the new comment to the comments list
      setComments((prev) => [...prev, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert(error.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleUserAction = async (action, userId, userData) => {
    switch (action) {
      case 'add':
        try {
          const response = await usersAPI.createUser(userData);
          setUsers((prev) => [...prev, response.data]);
        } catch (error) {
          console.error('Failed to create user:', error);
          alert(error.response?.data?.message || 'Failed to create user');
        }
        break;
      case 'edit':
        try {
          const response = await usersAPI.updateUser(userId, userData);
          setUsers((prev) =>
            prev.map((user) =>
              user._id === userId ? { ...user, ...response.data } : user
            )
          );
        } catch (error) {
          console.error('Failed to u[date user:', error);
          alert(error.response?.data?.message || 'Failed to update user');
        }

        break;
      case 'delete':
        try {
          await usersAPI.deleteUser(userId);
          setUsers((prev) => prev.filter((user) => user._id !== userId));
        } catch (error) {
          console.error('Failed to delete user:', error);
          alert(error.response?.data?.message || 'Failed to delete user');
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
        if (
          filters.assignee !== 'Unassigned' &&
          ticket.assignedTo?.email !== filters.assignee
        )
          return false;
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
          return a.clientEmail.localeCompare(b.clientEmail);
        case 'Assignee':
          return (a.assignedTo?.name || 'Unassigned').localeCompare(
            b.assignedTo?.name || 'Unassigned'
          );
        case 'Created Date':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  return (
    <div ref={containerRef}>
      {currentView === 'tickets' && (
        <EngLeadTicketList
          tickets={filteredTickets}
          allTickets={tickets}
          users={users}
          userEmail={user.email}
          filters={filters}
          onLogout={handleLogout}
          onViewTicket={handleViewTicket}
          onNavigateToUsers={handleNavigateToUsers}
          onFilterChange={handleFilterChange}
          onAssignTicket={handleAssignTicket}
        />
      )}
      {currentView === 'detail' && selectedTicket && (
        <EngLeadTicketDetail
          ticket={selectedTicket}
          comments={comments}
          users={users}
          userEmail={user.email}
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
          userEmail={user.email}
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
