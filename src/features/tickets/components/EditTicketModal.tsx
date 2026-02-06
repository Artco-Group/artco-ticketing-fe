import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  type Ticket,
  TicketCategory,
  TicketPriority,
} from '@artco-group/artco-ticketing-sync';
import {
  Modal,
  Button,
  Input,
  Textarea,
  Select,
  Label,
  useToast,
} from '@/shared/components/ui';
import { useUpdateTicket } from '../api/tickets-api';
import { getErrorMessage } from '@/shared';
import type { TicketId } from '@/types';

const editTicketSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  priority: z.string().min(1, 'Priority is required'),
  affectedModule: z.string().optional(),
  reproductionSteps: z.string().optional(),
  expectedResult: z.string().optional(),
  actualResult: z.string().optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
});

type EditTicketFormData = z.infer<typeof editTicketSchema>;

interface EditTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket;
  onSuccess?: () => void;
}

const categoryOptions = [
  { label: 'Bug', value: TicketCategory.BUG },
  { label: 'Feature Request', value: TicketCategory.FEATURE_REQUEST },
  { label: 'Question', value: TicketCategory.QUESTION },
  { label: 'Other', value: TicketCategory.OTHER },
];

const priorityOptions = [
  { label: 'Low', value: TicketPriority.LOW },
  { label: 'Medium', value: TicketPriority.MEDIUM },
  { label: 'High', value: TicketPriority.HIGH },
  { label: 'Critical', value: TicketPriority.CRITICAL },
];

export function EditTicketModal({
  isOpen,
  onClose,
  ticket,
  onSuccess,
}: EditTicketModalProps) {
  const toast = useToast();
  const updateTicket = useUpdateTicket();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<EditTicketFormData>({
    resolver: zodResolver(editTicketSchema),
    defaultValues: {
      title: ticket.title || '',
      description: ticket.description || '',
      category: ticket.category || '',
      priority: ticket.priority || '',
      affectedModule: ticket.affectedModule || '',
      reproductionSteps: ticket.reproductionSteps || '',
      expectedResult: ticket.expectedResult || '',
      actualResult: ticket.actualResult || '',
      startDate: ticket.startDate
        ? new Date(ticket.startDate).toISOString().split('T')[0]
        : '',
      dueDate: ticket.dueDate
        ? new Date(ticket.dueDate).toISOString().split('T')[0]
        : '',
    },
  });

  // Reset form when ticket changes
  useEffect(() => {
    reset({
      title: ticket.title || '',
      description: ticket.description || '',
      category: ticket.category || '',
      priority: ticket.priority || '',
      affectedModule: ticket.affectedModule || '',
      reproductionSteps: ticket.reproductionSteps || '',
      expectedResult: ticket.expectedResult || '',
      actualResult: ticket.actualResult || '',
      startDate: ticket.startDate
        ? new Date(ticket.startDate).toISOString().split('T')[0]
        : '',
      dueDate: ticket.dueDate
        ? new Date(ticket.dueDate).toISOString().split('T')[0]
        : '',
    });
  }, [ticket, reset]);

  const onSubmit = (data: EditTicketFormData) => {
    const ticketId = (ticket._id || ticket.id) as TicketId;
    updateTicket.mutate(
      { id: ticketId, data },
      {
        onSuccess: () => {
          toast.success('Ticket updated successfully');
          onSuccess?.();
          onClose();
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // eslint-disable-next-line react-hooks/incompatible-library
  const category = watch('category');
  const isBug = category === TicketCategory.BUG;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Ticket"
      maxWidth="lg"
      actions={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={updateTicket.isPending || !isDirty}
          >
            {updateTicket.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </>
      }
    >
      <form className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            {...register('title')}
            error={errors.title?.message}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            rows={4}
            error={errors.description?.message}
          />
        </div>

        {/* Category & Priority Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              options={categoryOptions}
              value={watch('category')}
              onChange={(value) =>
                setValue('category', value, { shouldDirty: true })
              }
              error={errors.category?.message}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              options={priorityOptions}
              value={watch('priority')}
              onChange={(value) =>
                setValue('priority', value, { shouldDirty: true })
              }
              error={errors.priority?.message}
            />
          </div>
        </div>

        {/* Start Date & Due Date Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date (Optional)</Label>
            <Input id="startDate" type="date" {...register('startDate')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date (Optional)</Label>
            <Input id="dueDate" type="date" {...register('dueDate')} />
          </div>
        </div>

        {/* Affected Module */}
        <div className="space-y-2">
          <Label htmlFor="affectedModule">Affected Module (Optional)</Label>
          <Input id="affectedModule" {...register('affectedModule')} />
        </div>

        {/* Bug-specific fields */}
        {isBug && (
          <>
            <div className="space-y-2">
              <Label htmlFor="reproductionSteps">Reproduction Steps</Label>
              <Textarea
                id="reproductionSteps"
                {...register('reproductionSteps')}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedResult">Expected Result</Label>
              <Textarea
                id="expectedResult"
                {...register('expectedResult')}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="actualResult">Actual Result</Label>
              <Textarea
                id="actualResult"
                {...register('actualResult')}
                rows={2}
              />
            </div>
          </>
        )}
      </form>
    </Modal>
  );
}
