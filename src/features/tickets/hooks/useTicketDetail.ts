import type { FormEvent } from 'react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  asTicketId,
  type Comment,
  type Ticket,
  type TicketId,
  type UserId,
} from '@/types';

import { PAGE_ROUTES, getErrorMessage } from '@/shared';
import { useToast } from '@/shared/components/ui';
import { useAuth } from '@/features/auth/context';
import {
  useTicket,
  useUpdateTicketStatus,
  useAssignTicket,
  useUpdateTicketPriority,
} from '../api/tickets-api';
import { useComments, useAddComment } from '../api/comments-api';
import { useUsers } from '@/features/users/api';

/**
 * Custom hook for ticket detail page logic.
 * Separates business logic from UI for better testability and maintainability.
 */
export function useTicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [newComment, setNewComment] = useState('');
  const [localTicket, setLocalTicket] = useState<Ticket | null>(null);
  const [localComments, setLocalComments] = useState<Comment[] | null>(null);

  // Fetch ticket data
  const ticketId = id ? asTicketId(id) : asTicketId('');
  const { data: ticketData, isLoading: ticketLoading } = useTicket(ticketId);

  // Fetch users (for eng lead assignment)
  const { data: usersData } = useUsers();
  const users = usersData?.data?.users || [];

  // Fetch comments
  const { data: commentsData, refetch: refetchComments } =
    useComments(ticketId);

  // Mutations
  const updateStatusMutation = useUpdateTicketStatus();
  const assignTicketMutation = useAssignTicket();
  const updatePriorityMutation = useUpdateTicketPriority();
  const addCommentMutation = useAddComment();

  // Use local state if available, otherwise use fetched data
  const ticket = localTicket ?? ticketData?.data?.ticket ?? null;
  const comments = localComments ?? commentsData?.data?.comments ?? [];

  const handleBack = () => {
    navigate(PAGE_ROUTES.DASHBOARD.ROOT);
  };

  const handleStatusUpdate = async (id: TicketId, newStatus: string) => {
    try {
      const response = await updateStatusMutation.mutateAsync({
        id,
        status: newStatus,
      });
      setLocalTicket(response.data.ticket);
      toast.success('Ticket status updated successfully');
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const handleAssignTicket = async (id: TicketId, developerId: UserId) => {
    try {
      const response = await assignTicketMutation.mutateAsync({
        id,
        developerId,
      });
      setLocalTicket(response.data.ticket);
      toast.success('Ticket assigned successfully');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handlePriorityUpdate = async (id: TicketId, newPriority: string) => {
    try {
      const response = await updatePriorityMutation.mutateAsync({
        id,
        priority: newPriority,
      });
      setLocalTicket(response.data.ticket);
      toast.success('Ticket priority updated successfully');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !id) return;

    try {
      await addCommentMutation.mutateAsync({
        ticketId: asTicketId(id),
        comment: { text: newComment },
      });
      setNewComment('');
      toast.success('Comment added successfully');
      const result = await refetchComments();
      if (result.data?.data?.comments) {
        setLocalComments(result.data.data.comments);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return {
    // Data
    ticket,
    comments,
    currentUser: user,
    users,

    // State
    ticketLoading,
    newComment,

    // Handlers
    onBack: handleBack,
    onStatusUpdate: handleStatusUpdate,
    onPriorityUpdate: handlePriorityUpdate,
    onAssignTicket: handleAssignTicket,
    onCommentChange: setNewComment,
    onAddComment: handleAddComment,
  };
}
