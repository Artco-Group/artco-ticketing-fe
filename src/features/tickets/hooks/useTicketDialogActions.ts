import { type Ticket } from '@artco-group/artco-ticketing-sync';
import { useToast } from '@/shared/components/ui';
import { getErrorMessage } from '@/shared';
import { asTicketId } from '@/types';
import { useCreateTicket, useUpdateTicket } from '../api/tickets-api';
import {
  type TicketFormData,
  type CreateFormData,
} from './useTicketDialogForm';

interface UseTicketDialogActionsOptions {
  ticket?: Ticket | null;
  clientEmail?: string;
  onSuccess?: () => void;
  onClose: () => void;
}

function buildCreateFormData(
  data: CreateFormData,
  clientEmail: string
): FormData {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('category', data.category);
  formData.append('clientEmail', clientEmail);

  if (data.priority) formData.append('priority', data.priority);
  if (data.affectedModule)
    formData.append('affectedModule', data.affectedModule);
  if (data.project) formData.append('project', data.project);
  if (data.reproductionSteps)
    formData.append('reproductionSteps', data.reproductionSteps);
  if (data.expectedResult)
    formData.append('expectedResult', data.expectedResult);
  if (data.actualResult) formData.append('actualResult', data.actualResult);
  if (data.assignedTo) formData.append('assignedTo', data.assignedTo);
  if (data.startDate) formData.append('startDate', data.startDate);
  if (data.dueDate) formData.append('dueDate', data.dueDate);

  return formData;
}

export function useTicketDialogActions({
  ticket,
  clientEmail = '',
  onSuccess,
  onClose,
}: UseTicketDialogActionsOptions) {
  const toast = useToast();
  const createMutation = useCreateTicket();
  const updateMutation = useUpdateTicket();

  const isEditing = !!ticket;
  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (data: TicketFormData) => {
    try {
      if (isEditing && ticket) {
        await updateMutation.mutateAsync({
          id: asTicketId(ticket.ticketId || ''),
          data,
        });
        toast.success('Ticket updated successfully');
      } else {
        const formData = buildCreateFormData(
          data as CreateFormData,
          clientEmail
        );
        await createMutation.mutateAsync(formData);
        toast.success('Ticket created successfully');
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
