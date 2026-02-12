import { TicketCategory, type User } from '@artco-group/artco-ticketing-sync';
import {
  Input,
  Textarea,
  Select,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  DatePicker,
} from '@/shared/components/ui';
import { MemberPicker } from '@/shared/components/composite/MemberPicker';
import { type UseFormReturn } from 'react-hook-form';
import { type TicketFormData } from '../hooks/useTicketDialogForm';
import {
  CATEGORY_FORM_OPTIONS,
  PRIORITY_FORM_OPTIONS,
} from '../utils/ticket-options';

interface ProjectOption {
  label: string;
  value: string;
}

interface TicketFormProps {
  form: UseFormReturn<TicketFormData>;
  formId: string;
  onSubmit: () => void;
  isEditing?: boolean;
  projectOptions: ProjectOption[];
  isProjectLocked?: boolean;
  developerUsers?: User[];
  canAssign?: boolean;
}

export function TicketForm({
  form,
  formId,
  onSubmit,
  isEditing = false,
  projectOptions,
  isProjectLocked = false,
  developerUsers = [],
  canAssign = false,
}: TicketFormProps) {
  const category = form.watch('category');
  const isBug = category === TicketCategory.BUG;

  return (
    <Form {...form}>
      <form id={formId} onSubmit={onSubmit} className="space-y-5">
        <FormField
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <FormItem className="space-y-0">
              <Input
                label="Title"
                autoComplete="off"
                error={fieldState.error?.message}
                required
                {...field}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <FormItem className="space-y-0">
              <Textarea
                label="Description"
                placeholder="Describe the issue or request in detail"
                rows={5}
                error={fieldState.error?.message}
                required
                {...field}
              />
            </FormItem>
          )}
        />

        {!isEditing && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-0">
                  <Select
                    label="Category"
                    options={CATEGORY_FORM_OPTIONS}
                    placeholder="Select category"
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
                <FormItem className="space-y-0">
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
          </div>
        )}
        {!isEditing && (
          <FormField
            control={form.control}
            name="project"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-0">
                <Select
                  label="Project"
                  options={projectOptions}
                  placeholder="Select project"
                  error={fieldState.error?.message}
                  disabled={isProjectLocked}
                  required
                  {...field}
                />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="affectedModule"
          render={({ field, fieldState }) => (
            <FormItem className="space-y-0">
              <Input
                label="Affected Module"
                placeholder="e.g., Mobile App, Admin Panel"
                autoComplete="off"
                error={fieldState.error?.message}
                {...field}
              />
            </FormItem>
          )}
        />

        {canAssign && developerUsers.length > 0 && !isEditing && (
          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Assignee</FormLabel>
                <FormControl>
                  <MemberPicker
                    value={field.value || ''}
                    options={developerUsers}
                    onChange={(value) =>
                      field.onChange(Array.isArray(value) ? value[0] : value)
                    }
                    placeholder="Select assignee"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {!isEditing && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-0">
                  <DatePicker
                    label="Start Date"
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-0">
                  <DatePicker
                    label="Due Date"
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                </FormItem>
              )}
            />
          </div>
        )}
        {isBug && (
          <>
            <FormField
              control={form.control}
              name="reproductionSteps"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-0">
                  <Textarea
                    label="Reproduction Steps"
                    placeholder="1. Go to...&#10;2. Click on...&#10;3. Observe..."
                    rows={4}
                    error={fieldState.error?.message}
                    {...field}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expectedResult"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-0">
                  <Textarea
                    label="Expected Result"
                    placeholder="What should happen?"
                    rows={2}
                    error={fieldState.error?.message}
                    {...field}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="actualResult"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-0">
                  <Textarea
                    label="Actual Result"
                    placeholder="What actually happens?"
                    rows={2}
                    error={fieldState.error?.message}
                    {...field}
                  />
                </FormItem>
              )}
            />
          </>
        )}
      </form>
    </Form>
  );
}

export default TicketForm;
