import type { FormEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { Ticket, Comment, Filters } from '@/types';
import type { AxiosError } from 'axios';

import { DeveloperTicketList, DeveloperTicketDetail } from '../components';

import { useAuth } from '@/features/auth/context';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Skeleton } from '@/shared/components/ui';
import PageHeader from '@/shared/components/layout/PageHeader';
import { useTickets, useUpdateTicketStatus } from '../api/tickets-api';
import { useComments, useAddComment } from '../api/comments-api';

interface ApiErrorResponse {
  message?: string;
}

type ViewState = 'list' | 'detail';

function DeveloperDashboard() {
  const [currentView, setCurrentView] = useState<ViewState>('list');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [filters, setFilters] = useState<Filters>({
    status: 'All',
    priority: 'All',
    sortBy: 'Created Date',
  });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [pendingTicket, setPendingTicket] = useState<Ticket | null>(null);

  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Comment state
  const [newComment, setNewComment] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);

  // React Query hooks
  const { data: ticketsData, isLoading: ticketsLoading } = useTickets();
  const allTickets = ticketsData?.tickets || [];
  // Filter tickets assigned to this developer
  const tickets = allTickets.filter((ticket) => {
    if (typeof ticket.assignedTo === 'string') {
      return ticket.assignedTo === user?.email;
    }
    return ticket.assignedTo?.email === user?.email;
  });

  const updateStatusMutation = useUpdateTicketStatus();

  const { data: commentsData, refetch: refetchComments } = useComments(
    selectedTicket?._id || ''
  );

  const addCommentMutation = useAddComment();

  // Update comments when selected ticket changes
  useEffect(() => {
    if (commentsData?.comments) {
      setComments(commentsData.comments);
    }
  }, [commentsData]);

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

  const handleViewTicket = async (ticket: Ticket) => {
    // Auto-transition Open -> In Progress with confirmation
    if (ticket.status === 'Open') {
      setPendingTicket(ticket);
      setShowStatusModal(true);
    } else {
      // Directly open ticket if not "Open" status
      await openTicketDetail(ticket);
    }
  };

  const openTicketDetail = async (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setCurrentView('detail');

    // Update URL with ticket param
    setSearchParams({ ticket: ticket._id || '' });

    // Comments will be fetched automatically via useComments hook
    refetchComments();
  };

  const handleConfirmStatusChange = async () => {
    if (!pendingTicket) return;

    try {
      const response = await updateStatusMutation.mutateAsync({
        id: pendingTicket._id || '',
        status: 'In Progress',
      });
      const updatedTicket = response.ticket;
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
    setCurrentView('list');
    setSelectedTicket(null);
    setComments([]);

    // Remove ticket param from URL
    searchParams.delete('ticket');
    setSearchParams(searchParams);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleStatusUpdate = async (ticketId: string, newStatus: string) => {
    try {
      const response = await updateStatusMutation.mutateAsync({
        id: ticketId,
        status: newStatus,
      });
      const updatedTicket = response.ticket;

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

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedTicket) return;

    try {
      await addCommentMutation.mutateAsync({
        ticketId: selectedTicket._id || '',
        comment: { text: newComment },
      });
      setNewComment('');
      toast.success('Comment added successfully');
      refetchComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast.error(
        axiosError.response?.data?.message || 'Failed to add comment'
      );
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
        case 'Priority': {
          const priorityOrder: Record<string, number> = {
            Critical: 4,
            High: 3,
            Medium: 2,
            Low: 1,
          };
          return (
            (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
          );
        }
        case 'Status':
          return a.status.localeCompare(b.status);
        case 'Created Date':
        default:
          return (
            new Date(b.createdAt || '').getTime() -
            new Date(a.createdAt || '').getTime()
          );
      }
    });

  if (ticketsLoading && currentView === 'list') {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <PageHeader userEmail={user?.email || ''} onLogout={handleLogout} />
        <main className="flex-1 p-6">
          <div className="mb-6">
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <th key={i} className="px-6 py-3">
                        <Skeleton className="h-4 w-24" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i}>
                      {[1, 2, 3, 4, 5, 6].map((j) => (
                        <td key={j} className="px-6 py-4">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      {currentView === 'list' && (
        <DeveloperTicketList
          tickets={filteredTickets}
          userEmail={user?.email || ''}
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
              This ticket will be marked as In Progress. Do you want to
              continue?
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
