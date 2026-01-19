import type { ChangeEvent, FormEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { Ticket, Comment, TicketFormData } from '@/types';
import type { AxiosError } from 'axios';

import {
  ClientTicketList,
  TicketForm,
  ClientTicketDetail,
} from '../components';
import { initialFormData } from '@/shared/utils/ticket-helpers';

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

  // Form state for new ticket
  const [formData, setFormData] = useState<TicketFormData>(initialFormData);

  // Screen recording state
  const [screenRecording, setScreenRecording] = useState<File | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);

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
    // TODO: Implement logout logic
  };

  const handleCreateTicket = () => {
    setCurrentView('create');
    setFormData(initialFormData);
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

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitTicket = async (e: FormEvent, files: File[]) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.description) {
      toast.error('Molimo popunite sva obavezna polja.');
      return;
    }

    try {
      // Create FormData to send files as multipart/form-data
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('clientEmail', user?.email || '');
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('affectedModule', formData.affectedModule || '');
      formDataToSend.append(
        'reproductionSteps',
        formData.reproductionSteps || ''
      );
      formDataToSend.append('expectedResult', formData.expectedResult || '');
      formDataToSend.append('actualResult', formData.actualResult || '');
      formDataToSend.append('priority', formData.priority || 'Low');

      // Append regular attachments
      files.forEach((file) => {
        formDataToSend.append('attachments', file);
      });

      // Append screen recording if present
      if (screenRecording) {
        formDataToSend.append('screenRecording', screenRecording);
        formDataToSend.append('recordingDuration', String(recordingDuration));
      }

      await createTicketMutation.mutateAsync(formDataToSend);

      // Reset screen recording state
      setScreenRecording(null);
      setRecordingDuration(0);

      // Wait a bit for backend to process
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Explicitly refetch tickets to ensure new ticket appears
      await refetchTickets();

      setCurrentView('list');
      toast.success('Ticket created successfully');
    } catch (error) {
      console.error('Failed to create ticket:', error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast.error(
        axiosError.response?.data?.message || 'Failed to create ticket'
      );
    }
  };

  const handleCancelCreate = () => {
    const hasData = Object.values(formData).some((val) =>
      Array.isArray(val) ? val.length > 0 : val !== ''
    );
    if (hasData) {
      if (
        confirm(
          'Imate nesačuvane podatke. Da li ste sigurni da želite odustati?'
        )
      ) {
        handleBackToList();
      }
    } else {
      handleBackToList();
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
          formData={formData}
          userEmail={user?.email || ''}
          onLogout={handleLogout}
          onFormChange={handleFormChange}
          onSubmit={handleSubmitTicket}
          onCancel={handleCancelCreate}
          onScreenRecordingChange={(file, duration) => {
            setScreenRecording(file);
            setRecordingDuration(duration);
          }}
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
