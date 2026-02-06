import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  TicketCategory,
  TicketPriority,
  TicketCategoryDisplay,
  TicketPriorityDisplay,
} from '@artco-group/artco-ticketing-sync';
import {
  SideDialog,
  Button,
  Input,
  Textarea,
  Select,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  useToast,
} from '@/shared/components/ui';
import { useAuth } from '@/features/auth/context';
import { useCreateTicket } from '../api/tickets-api';
import { useProjects } from '@/features/projects/api/projects-api';
import { getErrorMessage } from '@/shared';

const ticketFormSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().min(1, 'Description is required'),
  category: z.nativeEnum(TicketCategory, {
    errorMap: () => ({ message: 'Please select a category' }),
  }),
  priority: z.nativeEnum(TicketPriority).optional(),
  affectedModule: z.string().trim().optional(),
  project: z.string().optional(),
});

type TicketFormData = z.infer<typeof ticketFormSchema>;

interface TicketCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  onSuccess?: () => void;
}

export function TicketCreateDialog({
  isOpen,
  onClose,
  projectId,
  onSuccess,
}: TicketCreateDialogProps) {
  const { user } = useAuth();
  const toast = useToast();
  const createTicketMutation = useCreateTicket();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch projects for the select dropdown
  const { data: projectsData } = useProjects();
  const projects = useMemo(
    () => projectsData?.data?.projects || [],
    [projectsData?.data?.projects]
  );

  // Build project options for select
  const projectOptions = useMemo(
    () =>
      projects.map((project) => ({
        label: project.name,
        value: (project._id || project.id) as string,
      })),
    [projects]
  );

  // Check if project is locked (opened from project detail page)
  const isProjectLocked = !!projectId;

  const form = useForm<TicketFormData>({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      title: '',
      description: '',
      category: undefined,
      priority: TicketPriority.MEDIUM,
      affectedModule: '',
      project: projectId || '',
    },
  });

  const handleSubmit = async (data: TicketFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('clientEmail', user?.email || '');

      if (data.priority) {
        formData.append('priority', data.priority);
      }
      if (data.affectedModule) {
        formData.append('affectedModule', data.affectedModule);
      }
      if (data.project) {
        formData.append('project', data.project);
      }

      await createTicketMutation.mutateAsync(formData);
      toast.success('Ticket created successfully');
      form.reset({
        title: '',
        description: '',
        category: undefined,
        priority: TicketPriority.MEDIUM,
        affectedModule: '',
        project: projectId || '',
      });
      onClose();
      onSuccess?.();
    } catch (error) {
      toast.error(getErrorMessage(error) || 'Failed to create ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset({
      title: '',
      description: '',
      category: undefined,
      priority: TicketPriority.MEDIUM,
      affectedModule: '',
      project: projectId || '',
    });
    onClose();
  };

  return (
    <SideDialog
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Ticket"
      description="Fill in the details to create a new ticket."
      width="lg"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <FormItem>
                <Input
                  label="Title"
                  placeholder="Brief description of the issue"
                  autoComplete="off"
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field, fieldState }) => (
              <FormItem>
                <Select
                  label="Category"
                  options={[
                    {
                      label: TicketCategoryDisplay[TicketCategory.BUG],
                      value: TicketCategory.BUG,
                    },
                    {
                      label:
                        TicketCategoryDisplay[TicketCategory.FEATURE_REQUEST],
                      value: TicketCategory.FEATURE_REQUEST,
                    },
                    {
                      label: TicketCategoryDisplay[TicketCategory.QUESTION],
                      value: TicketCategory.QUESTION,
                    },
                    {
                      label: TicketCategoryDisplay[TicketCategory.OTHER],
                      value: TicketCategory.OTHER,
                    },
                  ]}
                  placeholder="Select a category"
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field, fieldState }) => (
              <FormItem>
                <Select
                  label="Priority"
                  options={[
                    {
                      label: TicketPriorityDisplay[TicketPriority.LOW],
                      value: TicketPriority.LOW,
                    },
                    {
                      label: TicketPriorityDisplay[TicketPriority.MEDIUM],
                      value: TicketPriority.MEDIUM,
                    },
                    {
                      label: TicketPriorityDisplay[TicketPriority.HIGH],
                      value: TicketPriority.HIGH,
                    },
                    {
                      label: TicketPriorityDisplay[TicketPriority.CRITICAL],
                      value: TicketPriority.CRITICAL,
                    },
                  ]}
                  placeholder="Select priority"
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="project"
            render={({ field, fieldState }) => (
              <FormItem>
                <Select
                  label="Project"
                  options={projectOptions}
                  placeholder="Select a project (optional)"
                  error={fieldState.error?.message}
                  disabled={isProjectLocked}
                  {...field}
                />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="affectedModule"
            render={({ field, fieldState }) => (
              <FormItem>
                <Input
                  label="Affected Module (Optional)"
                  placeholder="e.g., Mobile App, Admin Panel"
                  autoComplete="off"
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the issue or request in detail"
                    rows={6}
                    className="resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-3 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Ticket'}
            </Button>
          </div>
        </form>
      </Form>
    </SideDialog>
  );
}

export default TicketCreateDialog;
