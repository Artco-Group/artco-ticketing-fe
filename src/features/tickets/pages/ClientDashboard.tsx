import type { FormEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import type {
  Ticket,
  Comment,
  CreateTicketFormData,
} from '@artco-group/artco-ticketing-sync/types';
import type { AxiosError } from 'axios';

import {
  ClientTicketList,
  TicketForm,
  ClientTicketDetail,
} from '../components';

import { useAuth } from '@/features/auth/context';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Skeleton } from '@/shared/components/ui';
import PageHeader from '@/shared/components/layout/PageHeader';
import { useTickets, useCreateTicket } from '../api/tickets-api';
import { useComments, useAddComment } from '../api/comments-api';

interface ApiErrorResponse {
  message?: string;
}

type ViewState = 'list' | 'create' | 'detail';

function ClientDashboard() {
  const [currentView, setCurrentView] = useState<ViewState>('list');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Comment state
  const [newComment, setNewComment] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);

  // React Query hooks
  const {
    data: ticketsData,
    isLoading: ticketsLoading,
    refetch: refetchTickets,
  } = useTickets();

  // Handle both array and object response formats
  // API returns array directly: [ticket1, ticket2, ...]
  // Or object with tickets property: { tickets: [ticket1, ticket2, ...] }
  const tickets = Array.isArray(ticketsData)
    ? ticketsData
    : ticketsData?.tickets || [];

  const createTicketMutation = useCreateTicket();

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
        handleViewTicket(ticket);
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

      const ticketCards =
        containerRef.current?.querySelectorAll('.ticket-card');
      if (ticketCards && ticketCards.length > 0) {
        gsap.fromTo(
          ticketCards,
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
  }, [currentView, ticketsLoading]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateTicket = () => {
    setCurrentView('create');
  };

  const handleViewTicket = async (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setCurrentView('detail');

    // Update URL with ticket param
    setSearchParams({ ticket: ticket._id || '' });

    // Comments will be fetched automatically via useComments hook
    refetchComments();
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedTicket(null);
    setComments([]);

    // Remove ticket param from URL
    searchParams.delete('ticket');
    setSearchParams(searchParams);
  };

  const handleSubmitTicket = async (
    data: CreateTicketFormData,
    files: File[],
    screenRecording: { file: File; duration: number } | null
  ) => {
    try {
      // Create FormData to send files as multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append('title', data.title);
      formDataToSend.append('clientEmail', user?.email || '');
      formDataToSend.append('category', data.category);
      formDataToSend.append('description', data.description);

      if (data.affectedModule) {
        formDataToSend.append('affectedModule', data.affectedModule);
      }
      if (data.reproductionSteps) {
        formDataToSend.append('reproductionSteps', data.reproductionSteps);
      }
      if (data.expectedResult) {
        formDataToSend.append('expectedResult', data.expectedResult);
      }
      if (data.actualResult) {
        formDataToSend.append('actualResult', data.actualResult);
      }
      if (data.priority) {
        formDataToSend.append('priority', data.priority);
      }

      // Append regular attachments
      files.forEach((file) => {
        formDataToSend.append('attachments', file);
      });

      // Append screen recording if present
      if (screenRecording) {
        formDataToSend.append('screenRecording', screenRecording.file);
        formDataToSend.append(
          'recordingDuration',
          String(screenRecording.duration)
        );
      }

      await createTicketMutation.mutateAsync(formDataToSend);

      // Wait a bit for backend to process
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Explicitly refetch tickets to ensure new ticket appears
      await refetchTickets();

      setCurrentView('list');
      toast.success('Tiket uspješno kreiran');
    } catch (error) {
      console.error('Failed to create ticket:', error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast.error(
        axiosError.response?.data?.message || 'Greška pri kreiranju tiketa'
      );
    }
  };

  const handleCancelCreate = () => {
    // TicketForm now manages its own state, so we can just go back
    // If needed, we could add a confirmation dialog here
    handleBackToList();
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
      toast.success('Komentar uspješno dodan');
      refetchComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast.error(
        axiosError.response?.data?.message || 'Greška pri dodavanju komentara'
      );
    }
  };

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
        <ClientTicketList
          tickets={tickets}
          userEmail={user?.email || ''}
          onLogout={handleLogout}
          onCreateTicket={handleCreateTicket}
          onViewTicket={handleViewTicket}
        />
      )}
      {currentView === 'create' && (
        <TicketForm
          userEmail={user?.email || ''}
          onLogout={handleLogout}
          onSubmit={handleSubmitTicket}
          onCancel={handleCancelCreate}
          isSubmitting={createTicketMutation.isPending}
        />
      )}
      {currentView === 'detail' && selectedTicket && (
        <ClientTicketDetail
          ticket={selectedTicket}
          comments={comments}
          userEmail={user?.email || ''}
          onLogout={handleLogout}
          onBack={handleBackToList}
          newComment={newComment}
          onCommentChange={setNewComment}
          onAddComment={handleAddComment}
          currentUser={user}
        />
      )}
    </div>
  );
}

export default ClientDashboard;
