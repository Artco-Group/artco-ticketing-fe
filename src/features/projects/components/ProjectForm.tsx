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
  FormLabel,
  Input,
  Select,
  Textarea,
  DatePicker,
} from '@/shared/components/ui';
import { MemberPicker } from '@/shared/components/composite/MemberPicker';
import { useProjectForm } from '../hooks/useProjectForm';

const PRIORITY_OPTIONS = Object.values(ProjectPriority).map((priority) => ({
  label: ProjectPriorityDisplay[priority],
  value: priority,
}));

interface ProjectFormProps {
  formId: string;
  onSubmit: (data: CreateProjectFormData | UpdateProjectFormData) => void;
  defaultValues?: Partial<CreateProjectFormData>;
  isEditing?: boolean;
  users: User[];
}

function ProjectForm({
  formId,
  onSubmit,
  defaultValues,
  isEditing = false,
  users,
}: ProjectFormProps) {
  const { form, onSubmit: handleSubmit } = useProjectForm({
    defaultValues,
    isEditing,
    onSubmit,
  });

  const clientUsers = users.filter((user) => user.role === UserRole.CLIENT);
  const leadUsers = users.filter((user) => user.role === UserRole.ENG_LEAD);

  return (
    <Form {...form}>
      <form id={formId} onSubmit={handleSubmit} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem className="space-y-0">
              <Input
                label="Project Name"
                placeholder="Enter project name"
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
                placeholder="Enter project description"
                error={fieldState.error?.message}
                {...field}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="client"
          render={({ field, fieldState }) => (
            <FormItem className="space-y-2">
              <FormLabel>
                Client<span className="text-destructive ml-0.5">*</span>
              </FormLabel>
              <FormControl>
                <MemberPicker
                  value={field.value}
                  options={clientUsers}
                  onChange={(value) =>
                    field.onChange(Array.isArray(value) ? value[0] : value)
                  }
                  placeholder="Select client..."
                />
              </FormControl>
              {fieldState.error?.message && (
                <p className="text-destructive text-xs font-medium">
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
            <FormItem className="space-y-2">
              <FormLabel>
                Project Lead(s)
                <span className="text-destructive ml-0.5">*</span>
              </FormLabel>
              <FormControl>
                <MemberPicker
                  value={field.value}
                  options={leadUsers}
                  multiple
                  onChange={(value) =>
                    field.onChange(Array.isArray(value) ? value : [value])
                  }
                  placeholder="Select lead(s)..."
                />
              </FormControl>
              {fieldState.error?.message && (
                <p className="text-destructive text-xs font-medium">
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
            <FormItem className="space-y-0">
              <Select
                label="Priority"
                options={PRIORITY_OPTIONS}
                placeholder="Select priority"
                error={fieldState.error?.message}
                {...field}
              />
            </FormItem>
          )}
        />

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
                  required
                />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}

export default ProjectForm;
