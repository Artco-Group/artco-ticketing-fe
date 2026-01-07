import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

import {
  DeveloperTicketList,
  DeveloperTicketDetail,
} from '../components/dashboard';

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ticketAPI } from '../services/ticketApi';
import { commentAPI } from '../services/commentApi';

function DeveloperDashboard() {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'detail'
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [filters, setFilters] = useState({
    status: 'All',
    priority: 'All',
    sortBy: 'Created Date',
  });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingTicket, setPendingTicket] = useState(null);

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Comment state
  const [newComment, setNewComment] = useState('');

  const containerRef = useRef(null);

  // Fetch tickets from API (filtered by assignee on backend or here)
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setTicketsLoading(true);
        const response = await ticketAPI.getTickets();
        // Filter tickets assigned to this developer
        setTickets(response.data);
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
      } finally {
        setTicketsLoading(false);
      }
    };

    fetchTickets();
  }, [user?.email]);

  useEffect(() => {
    // GSAP animations on mount
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dashboard-header',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
      gsap.fromTo(
        '.ticket-row',
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
  }, [currentView, ticketsLoading]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleViewTicket = async (ticket) => {
    // Auto-transition Open -> In Progress with confirmation
    if (ticket.status === 'Open') {
      setPendingTicket(ticket);
      setShowStatusModal(true);
    } else {
      // Directly open ticket if not "Open" status
      await openTicketDetail(ticket);
    }
  };

  const openTicketDetail = async (ticket) => {
    setSelectedTicket(ticket);
    setCurrentView('detail');
    
    // Fetch comments for this ticket
    try {
      const response = await commentAPI.getComments(ticket.ticketId);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      setComments([]);
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!pendingTicket) return;
    
    try {
      const response = await ticketAPI.updateTicketStatus(pendingTicket._id, 'In Progress');
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
    setCurrentView('list');
    setSelectedTicket(null);
    setComments([]);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      const response = await ticketAPI.updateTicketStatus(ticketId, newStatus);
      const updatedTicket = response.data;

      setTickets((prev) =>
        prev.map((ticket) => (ticket.ticketId === ticketId ? updatedTicket : ticket))
      );

      if (selectedTicket && selectedTicket._id === ticketId) {
        setSelectedTicket(updatedTicket);
      }
    } catch (error) {
      console.error('Failed to update ticket status:', error);
      alert(error.response?.data?.message || 'Failed to update status');
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

  // Filter and sort tickets
  const filteredTickets = tickets
    .filter((ticket) => {
      if (filters.status !== 'All' && ticket.status !== filters.status)
        return false;
      if (filters.priority !== 'All' && ticket.priority !== filters.priority)
        return false;
      return true;
    })
    .sort((a, b) => {
      switch (filters.sortBy) {
        case 'Priority':
          const priorityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'Status':
          return a.status.localeCompare(b.status);
        case 'Created Date':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  return (
    <div ref={containerRef}>
      {currentView === 'list' && (
        <DeveloperTicketList
          tickets={filteredTickets}
          userEmail={user.email}
          filters={filters}
          onLogout={handleLogout}
          onViewTicket={handleViewTicket}
          onFilterChange={handleFilterChange}
        />
      )}
      {currentView === 'detail' && selectedTicket && (
        <DeveloperTicketDetail
          ticket={selectedTicket}
          comments={comments}
          onLogout={handleLogout}
          onBack={handleBackToList}
          onStatusUpdate={handleStatusUpdate}
          newComment={newComment}
          onCommentChange={setNewComment}
          onAddComment={handleAddComment}
          currentUser={user}
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
              This ticket will be marked as In Progress. Do you want to continue?
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

export default DeveloperDashboard;
