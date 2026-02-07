import { useMemo } from 'react';
import { type Ticket, TicketCategory } from '@artco-group/artco-ticketing-sync';
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
} from '@/shared/components/ui';
import { useAuth } from '@/features/auth/context';
import { useProjects } from '@/features/projects/api/projects-api';
import { useTicketDialogForm, useTicketDialogActions } from '../hooks';
import {
  CATEGORY_FORM_OPTIONS,
  PRIORITY_FORM_OPTIONS,
} from '../utils/ticket-options';

interface TicketDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ticket?: Ticket | null;
  projectId?: string;
  onSuccess?: () => void;
}

export function TicketDialog({
  isOpen,
  onClose,
  ticket,
  projectId,
  onSuccess,
}: TicketDialogProps) {
  const { user } = useAuth();
  const isProjectLocked = !!projectId;

  const { handleSubmit, isPending } = useTicketDialogActions({
    ticket,
    clientEmail: user?.email,
    onSuccess,
    onClose,
  });

  const { form, isEditing, onSubmit, resetForm } = useTicketDialogForm({
    ticket,
    projectId,
    isOpen,
    onSubmit: handleSubmit,
  });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const { data: projectsData } = useProjects();
  const projectOptions = useMemo(
    () =>
      (projectsData?.data?.projects || []).map((project) => ({
        label: project.name,
        value: (project._id || project.id) as string,
      })),
    [projectsData?.data?.projects]
  );

  const category = form.watch('category');
  const isBug = category === TicketCategory.BUG;

  return (
    <SideDialog
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Ticket' : 'Create Ticket'}
      description={
        isEditing
          ? 'Update ticket details.'
          : 'Fill in the details to create a new ticket.'
      }
      width="lg"
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Title */}
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

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field, fieldState }) => (
              <FormItem>
                <Select
                  label={isEditing ? 'Category' : 'Category *'}
                  options={CATEGORY_FORM_OPTIONS}
                  placeholder="Select a category"
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormItem>
            )}
          />

          {/* Priority - only for create mode */}
          {!isEditing && (
            <FormField
              control={form.control}
              name="priority"
              render={({ field, fieldState }) => (
                <FormItem>
                  <Select
                    label="Priority"
                    options={PRIORITY_FORM_OPTIONS}
                    placeholder="Select priority"
                    error={fieldState.error?.message}
                    {...field}
                  />
                </FormItem>
              )}
            />
          )}

          {/* Project */}
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

          {/* Dates - only for edit mode */}
          {isEditing && (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <Input label="Start Date" type="date" {...field} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <Input label="Due Date" type="date" {...field} />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Affected Module */}
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

          {/* Description */}
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

          {/* Bug-specific fields */}
          {isBug && (
            <>
              <FormField
                control={form.control}
                name="reproductionSteps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reproduction Steps</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="1. Go to...&#10;2. Click on...&#10;3. Observe..."
                        rows={4}
                        className="resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expectedResult"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Result</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What should happen?"
                        rows={2}
                        className="resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="actualResult"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Actual Result</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What actually happens?"
                        rows={2}
                        className="resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || (isEditing && !form.formState.isDirty)}
            >
              {isPending
                ? isEditing
                  ? 'Saving...'
                  : 'Creating...'
                : isEditing
                  ? 'Save Changes'
                  : 'Create Ticket'}
            </Button>
          </div>
        </form>
      </Form>
    </SideDialog>
  );
}

export default TicketDialog;
