import { type Ticket } from '@artco-group/artco-ticketing-sync';
import { useTranslatedToast } from '@/shared/hooks';
import { useToast } from '@/shared/components/ui';
import { getErrorMessage } from '@/shared';
import { asTicketId } from '@/types';
import { useCreateTicket, useUpdateTicket } from '../api/tickets-api';
import { useConvertEmailTicket } from '@/features/email-tickets/api/email-tickets-api';
import {
  type TicketFormData,
  type CreateFormData,
} from './useTicketDialogForm';

interface UseTicketDialogActionsOptions {
  ticket?: Ticket | null;
  clientEmail?: string;
  emailTicketId?: string;
  onSuccess?: () => void;
  onClose: () => void;
}

function buildCreateFormData(
  data: CreateFormData,
  clientEmail: string,
  emailTicketId?: string
): FormData {
  const formData = new FormData();
  const payload = { ...data, clientEmail };

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      formData.append(key, String(value));
    }
  });

  if (emailTicketId) {
    formData.append('emailTicketId', emailTicketId);
  }

  return formData;
}

export function useTicketDialogActions({
  ticket,
  clientEmail = '',
  emailTicketId,
  onSuccess,
  onClose,
}: UseTicketDialogActionsOptions) {
  const translatedToast = useTranslatedToast();
  const toast = useToast();
  const createMutation = useCreateTicket();
  const updateMutation = useUpdateTicket();
  const convertMutation = useConvertEmailTicket();

  const isEditing = !!ticket;
  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    convertMutation.isPending;

  const handleSubmit = async (data: TicketFormData) => {
    try {
      if (isEditing && ticket) {
        await updateMutation.mutateAsync({
          id: asTicketId(ticket.ticketId || ''),
          data,
        });
        translatedToast.success('toast.success.updated', { item: 'Ticket' });
      } else {
        const formData = buildCreateFormData(
          data as CreateFormData,
          clientEmail,
          emailTicketId
        );
        const result = await createMutation.mutateAsync(formData);

        // If creating from an email ticket, mark it as converted
        // useApiMutation unwraps ApiResponse, so result is { ticket: Ticket }
        const createdTicket = (
          result as unknown as { ticket?: Ticket } | undefined
        )?.ticket;
        if (emailTicketId && createdTicket?.ticketId) {
          await convertMutation.mutateAsync({
            id: emailTicketId,
            ticketId: createdTicket.ticketId,
          });
        }

        translatedToast.success('toast.success.created', { item: 'Ticket' });
      }

      onClose();
      onSuccess?.();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return {
    handleSubmit,
    isPending,
  };
}
