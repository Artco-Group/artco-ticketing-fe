import {
  type CreateProjectFormData,
  type UpdateProjectFormData,
  ProjectPriority,
  ProjectPriorityDisplay,
} from '@artco-group/artco-ticketing-sync';
import { type User, UserRole } from '@/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  Input,
  Button,
  Select,
  Textarea,
  Icon,
} from '@/shared/components/ui';
import { MemberPicker } from '@/shared/components/composite/MemberPicker';
import { useProjectForm } from '../hooks/useProjectForm';
import { cn } from '@/lib/utils';

const PRIORITY_OPTIONS = Object.values(ProjectPriority).map((priority) => ({
  label: ProjectPriorityDisplay[priority],
  value: priority,
}));

interface ProjectFormProps {
  onSubmit: (data: CreateProjectFormData | UpdateProjectFormData) => void;
  onCancel: () => void;
  defaultValues?: Partial<CreateProjectFormData>;
  isEditing?: boolean;
  isSubmitting?: boolean;
  users: User[];
}

function ProjectForm({
  onSubmit,
  onCancel,
  defaultValues,
  isEditing = false,
  isSubmitting = false,
  users,
}: ProjectFormProps) {
  const { form, onSubmit: handleSubmit } = useProjectForm({
    defaultValues,
    isEditing,
    onSubmit,
  });

  const clientUsers = users.filter((user) => user.role === UserRole.CLIENT);
  const leadUsers = users.filter(
    (user) => user.role === UserRole.ENG_LEAD || user.role === UserRole.ADMIN
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Input
                  label="Project Name"
                  placeholder="Enter project name"
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  label="Description"
                  placeholder="Enter project description"
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="client"
          render={({ field, fieldState }) => (
            <FormItem>
              <label className="text-text-tertiary font-[Inter] text-xs leading-4 font-normal">
                Client
              </label>
              <FormControl>
                <MemberPicker
                  value={field.value}
                  options={clientUsers}
                  onChange={(value) =>
                    field.onChange(Array.isArray(value) ? value[0] : value)
                  }
                  placeholder="Select client..."
                  label="Client"
                />
              </FormControl>
              {fieldState.error?.message && (
                <p className="text-destructive font-[Inter] text-xs font-medium">
                  {fieldState.error.message}
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="leads"
          render={({ field, fieldState }) => (
            <FormItem>
              <label className="text-text-tertiary font-[Inter] text-xs leading-4 font-normal">
                Project Lead(s)
              </label>
              <FormControl>
                <MemberPicker
                  value={field.value}
                  options={leadUsers}
                  multiple
                  onChange={(value) =>
                    field.onChange(Array.isArray(value) ? value : [value])
                  }
                  placeholder="Select lead(s)..."
                  label="Lead"
                />
              </FormControl>
              {fieldState.error?.message && (
                <p className="text-destructive font-[Inter] text-xs font-medium">
                  {fieldState.error.message}
                </p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Select
                  label="Priority"
                  options={PRIORITY_OPTIONS}
                  placeholder="Select priority"
                  error={fieldState.error?.message}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field, fieldState }) => (
              <FormItem>
                <label className="text-text-tertiary font-[Inter] text-xs leading-4 font-normal">
                  Start Date
                </label>
                <FormControl>
                  <div className="relative">
                    <Icon
                      name="clock"
                      size="sm"
                      className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                    />
                    <input
                      type="date"
                      className={cn(
                        'border-input bg-background flex h-10 w-full rounded-md border py-2 pr-3 pl-10 text-sm',
                        'ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium',
                        'placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:outline-none',
                        'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                        fieldState.error && 'border-destructive'
                      )}
                      value={field.value ? field.value.split('T')[0] : ''}
                      onChange={(e) => {
                        const dateValue = e.target.value;
                        field.onChange(
                          dateValue ? new Date(dateValue).toISOString() : ''
                        );
                      }}
                    />
                  </div>
                </FormControl>
                {fieldState.error?.message && (
                  <p className="text-destructive font-[Inter] text-xs font-medium">
                    {fieldState.error.message}
                  </p>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field, fieldState }) => (
              <FormItem>
                <label className="text-text-tertiary font-[Inter] text-xs leading-4 font-normal">
                  Due Date
                </label>
                <FormControl>
                  <div className="relative">
                    <Icon
                      name="clock"
                      size="sm"
                      className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                    />
                    <input
                      type="date"
                      className={cn(
                        'border-input bg-background flex h-10 w-full rounded-md border py-2 pr-3 pl-10 text-sm',
                        'ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium',
                        'placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:outline-none',
                        'focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                        fieldState.error && 'border-destructive'
                      )}
                      value={field.value ? field.value.split('T')[0] : ''}
                      onChange={(e) => {
                        const dateValue = e.target.value;
                        field.onChange(
                          dateValue ? new Date(dateValue).toISOString() : ''
                        );
                      }}
                    />
                  </div>
                </FormControl>
                {fieldState.error?.message && (
                  <p className="text-destructive font-[Inter] text-xs font-medium">
                    {fieldState.error.message}
                  </p>
                )}
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting
              ? 'Saving...'
              : isEditing
                ? 'Save Changes'
                : 'Create Project'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default ProjectForm;
