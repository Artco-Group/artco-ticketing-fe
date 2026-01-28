import { useNavigate } from 'react-router-dom';
import type { CreateTicketFormData } from '@artco-group/artco-ticketing-sync';

import { PAGE_ROUTES, getErrorMessage } from '@/shared';
import { useAuth } from '@/features/auth/context';
import { useCreateTicket } from '../api/tickets-api';
import { createTicketFormData } from '../utils/file-helpers';
import { useToast } from '@/shared/components/ui';

/**
 * Custom hook for ticket creation form logic.
 * Separates business logic from UI for better testability and maintainability.
 */
export function useTicketCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createTicketMutation = useCreateTicket();
  const toast = useToast();

  const handleSubmit = async (
    data: CreateTicketFormData,
    files: File[],
    screenRecording: { file: File; duration: number } | null
  ) => {
    try {
      const formData = createTicketFormData(
        data,
        user?.email || '',
        files,
        screenRecording
      );

      await createTicketMutation.mutateAsync(formData);

      toast.success('Tiket uspjesno kreiran');
      navigate(PAGE_ROUTES.DASHBOARD.ROOT);
    } catch (error) {
      console.error('Failed to create ticket:', error);
      toast.error(getErrorMessage(error) || 'Greska pri kreiranju tiketa');
    }
  };

  const handleCancel = () => {
    navigate(PAGE_ROUTES.DASHBOARD.ROOT);
  };

  return {
    onSubmit: handleSubmit,
    onCancel: handleCancel,
    isPending: createTicketMutation.isPending,
  };
}
