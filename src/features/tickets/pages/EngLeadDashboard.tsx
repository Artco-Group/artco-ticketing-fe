import type { FormEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import type {
  Ticket,
  Comment,
  CreateUserFormData,
  UpdateUserFormData,
} from '@artco-group/artco-ticketing-sync/types';
import type { Filters } from '@/types';
import type { AxiosError } from 'axios';

import { EngLeadTicketList, EngLeadTicketDetail } from '../components';
import { UserManagement as EngLeadUserManagement } from '@/features/users/components';

import { useAuth } from '@/features/auth/context';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Skeleton } from '@/shared/components/ui';
import Sidebar from '@/shared/components/layout/Sidebar';
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from '@/features/users/api';
import {
  useTickets,
  useUpdateTicketStatus,
  useAssignTicket,
  useUpdateTicketPriority,
} from '../api/tickets-api';
import { useComments, useAddComment } from '../api/comments-api';

interface ApiErrorResponse {
  message?: string;
}

type ViewState = 'tickets' | 'detail' | 'users';

function EngLeadDashboard() {
  const [currentView, setCurrentView] = useState<ViewState>('tickets');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
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

  // React Query hooks - only fetch when authenticated
  const { data: ticketsData, isLoading: ticketsLoading } = useTickets();
  // Handle both array and object response formats
  const tickets = Array.isArray(ticketsData)
    ? ticketsData
    : ticketsData?.tickets || [];

  const updateStatusMutation = useUpdateTicketStatus();
  const assignTicketMutation = useAssignTicket();
  const updatePriorityMutation = useUpdateTicketPriority();

  const { data: commentsData, refetch: refetchComments } = useComments(
    selectedTicket?._id || ''
  );

  const addCommentMutation = useAddComment();

  // React Query hooks for users
  const { data: usersData } = useUsers();
  const users = usersData?.users || [];
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

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
      const dashboardHeader =
        containerRef.current?.querySelector('.dashboard-header');
      if (dashboardHeader) {
        gsap.fromTo(
          dashboardHeader,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );
      }

      const ticketRows = containerRef.current?.querySelectorAll(
        '.ticket-row, .summary-card'
      );
      if (ticketRows && ticketRows.length > 0) {
        gsap.fromTo(
          ticketRows,
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
      }
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

    // Comments will be fetched automatically via useComments hook
    refetchComments();
  };

  const handleConfirmStatusChange = async () => {
    if (!pendingTicket) return;

    try {
      const response = await updateStatusMutation.mutateAsync({
        id: pendingTicket._id || '',
        status: 'Open',
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
      const response = await assignTicketMutation.mutateAsync({
        id: ticketId,
        assignedTo: developerId,
      });
      const updatedTicket = response.ticket;

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

  const handlePriorityUpdate = async (
    ticketId: string,
    newPriority: string
  ) => {
    try {
      const response = await updatePriorityMutation.mutateAsync({
        id: ticketId,
        priority: newPriority,
      });
      const updatedTicket = response.ticket;

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

  const handleUserAction = async (
    action: 'add' | 'edit' | 'delete',
    userId: string | null,
    userData?: CreateUserFormData | UpdateUserFormData
  ) => {
    try {
      switch (action) {
        case 'add':
          if (userData) {
            await createUserMutation.mutateAsync(
              userData as CreateUserFormData
            );
            toast.success('User created successfully');
          }
          break;
        case 'edit':
          if (userId && userData) {
            await updateUserMutation.mutateAsync({
              id: userId,
              data: userData as UpdateUserFormData,
            });
            toast.success('User updated successfully');
          }
          break;
        case 'delete':
          if (userId) {
            await deleteUserMutation.mutateAsync(userId);
            toast.success('User deleted successfully');
          }
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast.error(
        axiosError.response?.data?.message || `Failed to ${action} user`
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
          const statusOrder: Record<string, number> = {
            New: 1,
            Open: 2,
            'In Progress': 3,
            Resolved: 4,
            Closed: 5,
          };
          return (statusOrder[a.status] ?? 0) - (statusOrder[b.status] ?? 0);
        }
        case 'Priority': {
          const priorityOrder: Record<string, number> = {
            Critical: 4,
            High: 3,
            Medium: 2,
            Low: 1,
          };
          return (
            (priorityOrder[b.priority] ?? 0) - (priorityOrder[a.priority] ?? 0)
          );
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

  if (ticketsLoading && currentView === 'tickets') {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar
          userEmail={user?.email || ''}
          currentView="tickets"
          onLogout={handleLogout}
          onNavigateToTickets={() => {}}
          onNavigateToUsers={handleNavigateToUsers}
        />
        <div className="flex flex-1 flex-col">
          <header className="border-b border-gray-200 bg-white px-6 py-4">
            <Skeleton className="h-8 w-32" />
          </header>
          <main className="flex-1 p-6">
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200 bg-white p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Skeleton className="mb-2 h-4 w-32" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <Skeleton className="h-12 w-12 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-6">
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <th key={i} className="px-6 py-3">
                          <Skeleton className="h-4 w-24" />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i}>
                        {[1, 2, 3, 4, 5, 6, 7].map((j) => (
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
      </div>
    );
  }

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
