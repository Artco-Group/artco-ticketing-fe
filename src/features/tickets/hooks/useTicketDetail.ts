import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { asTicketId, type Ticket, type TicketId, type UserId } from '@/types';

import { PAGE_ROUTES, getErrorMessage } from '@/shared';
import { useToast } from '@/shared/components/ui';
import { useAuth } from '@/features/auth/context';
import {
  useTicket,
  useUpdateTicketStatus,
  useAssignTicket,
  useUpdateTicketPriority,
} from '../api/tickets-api';
import { useUsers } from '@/features/users/api';
import { useProjects } from '@/features/projects/api/projects-api';

export function useTicketDetail() {
  const { ticketId: ticketIdParam } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [localTicket, setLocalTicket] = useState<Ticket | null>(null);

  const ticketId = ticketIdParam ? asTicketId(ticketIdParam) : asTicketId('');
  const {
    data: ticketData,
    isLoading: ticketLoading,
    error: ticketError,
    refetch: refetchTicket,
    isRefetching: ticketRefetching,
  } = useTicket(ticketId);

  const { data: usersData } = useUsers();
  const users = usersData?.users || [];

  const { data: projectsData } = useProjects();
  const projects = projectsData?.projects || [];

  const updateStatusMutation = useUpdateTicketStatus();
  const assignTicketMutation = useAssignTicket();
  const updatePriorityMutation = useUpdateTicketPriority();

  const ticket = localTicket ?? ticketData?.ticket ?? null;

  const handleBack = () => {
    navigate(PAGE_ROUTES.DASHBOARD.ROOT);
  };

  const handleStatusUpdate = async (id: TicketId, newStatus: string) => {
    try {
      const response = await updateStatusMutation.mutateAsync({
        id,
        status: newStatus,
      });
      setLocalTicket(response.ticket);
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
      setLocalTicket(response.ticket);
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
      setLocalTicket(response.ticket);
      toast.success('Ticket priority updated successfully');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleOpenEditModal = () => setIsEditModalOpen(true);
  const handleCloseEditModal = () => setIsEditModalOpen(false);

  return {
    ticket,
    currentUser: user,
    users,
    projects,

    ticketLoading,
    ticketError,
    refetchTicket,
    ticketRefetching,

    isEditModalOpen,
    onOpenEditModal: handleOpenEditModal,
    onCloseEditModal: handleCloseEditModal,

    onBack: handleBack,
    onStatusUpdate: handleStatusUpdate,
    onPriorityUpdate: handlePriorityUpdate,
    onAssignTicket: handleAssignTicket,
  };
}
