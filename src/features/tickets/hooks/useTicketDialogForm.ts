import { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  type Ticket,
  createTicketSchema,
  updateTicketSchema,
  TicketPriority,
} from '@artco-group/artco-ticketing-sync';

export type CreateFormData = z.infer<typeof createTicketSchema>;
export type UpdateFormData = z.infer<typeof updateTicketSchema>;
export type TicketFormData = CreateFormData | UpdateFormData;

interface UseTicketDialogFormOptions {
  ticket?: Ticket | null;
  projectId?: string;
  isOpen: boolean;
  onSubmit: (data: TicketFormData) => void;
}

function getDefaultValues(
  ticket: Ticket | null | undefined,
  projectId?: string
): TicketFormData {
  if (ticket) {
    return {
      title: ticket.title || '',
      description: ticket.description || '',
      category: ticket.category as CreateFormData['category'],
      priority: ticket.priority as CreateFormData['priority'],
      affectedModule: ticket.affectedModule || '',
      project: (ticket.project?.id || '') as string,
      reproductionSteps: ticket.reproductionSteps || '',
      expectedResult: ticket.expectedResult || '',
      actualResult: ticket.actualResult || '',
      startDate: ticket.startDate
        ? new Date(ticket.startDate).toISOString().split('T')[0]
        : '',
      dueDate: ticket.dueDate
        ? new Date(ticket.dueDate).toISOString().split('T')[0]
        : '',
      tempSolutionDate: ticket.tempSolutionDate
        ? new Date(ticket.tempSolutionDate).toISOString().split('T')[0]
        : '',
      finalSolutionDate: ticket.finalSolutionDate
        ? new Date(ticket.finalSolutionDate).toISOString().split('T')[0]
        : '',
      assignedTo: ticket.assignedTo?.id || '',
      engLead: ticket.engLead?.id || '',
    } as UpdateFormData;
  }

  return {
    title: '',
    description: '',
    category: '' as CreateFormData['category'],
    priority: TicketPriority.MINOR as CreateFormData['priority'],
    affectedModule: '',
    project: projectId || '',
    reproductionSteps: '',
    expectedResult: '',
    actualResult: '',
    startDate: '',
    dueDate: '',
    tempSolutionDate: '',
    finalSolutionDate: '',
    assignedTo: '',
    engLead: '',
  };
}

export function useTicketDialogForm({
  ticket,
  projectId,
  isOpen,
  onSubmit,
}: UseTicketDialogFormOptions) {
  const isEditing = !!ticket;
  const schema = isEditing ? updateTicketSchema : createTicketSchema;

  const form = useForm<TicketFormData>({
    resolver: zodResolver(schema) as Resolver<TicketFormData>,
    defaultValues: getDefaultValues(ticket, projectId),
  });

  useEffect(() => {
    if (isOpen) {
      form.reset(getDefaultValues(ticket, projectId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- form is stable from react-hook-form
  }, [isOpen, ticket, projectId]);

  const resetForm = () => {
    form.reset(getDefaultValues(null, projectId));
  };

  return {
    form,
    isEditing,
    onSubmit: form.handleSubmit(onSubmit),
    resetForm,
  };
}
