import { useMemo } from 'react';
import {
  type CreateProjectFormData,
  type UpdateProjectFormData,
  ProjectPriority,
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
import { useAppTranslation } from '@/shared/hooks';

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
  const { translate, language } = useAppTranslation('projects');
  const { form, onSubmit: handleSubmit } = useProjectForm({
    defaultValues,
    isEditing,
    onSubmit,
  });

  const priorityOptions = useMemo(
    () =>
      Object.values(ProjectPriority).map((priority) => ({
        label: translate(`priority.${priority}`),
        value: priority,
      })),
    [translate]
  );

  const selectedClientId = form.watch('client');
  const clientUsers = users.filter((user) => user.role === UserRole.CLIENT);
  const selectedClient = clientUsers.find((u) => u.id === selectedClientId);
  const clientContracts = useMemo(
    () => selectedClient?.contracts || [],
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stable on client identity
    [selectedClient?.id]
  );

  const contractOptions = useMemo(
    () =>
      clientContracts.map((contract) => ({
        label: contract,
        value: contract,
      })),
    [clientContracts]
  );

  const leadUsers = users.filter((user) => user.role === UserRole.ENG_LEAD);
  const pmUsers = users.filter(
    (user) => user.role === UserRole.PROJECT_MANAGER
  );
  const developerUsers = users.filter(
    (user) =>
      user.role === UserRole.DEVELOPER || user.role === UserRole.TECHNICIAN
  );

  return (
    <Form {...form}>
      <form id={formId} onSubmit={handleSubmit} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem className="space-y-0">
              <Input
                label={translate('form.name')}
                placeholder={translate('form.namePlaceholder')}
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
                label={translate('form.description')}
                placeholder={translate('form.descriptionPlaceholder')}
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
                {translate('form.client')}
                <span className="text-destructive ml-0.5">*</span>
              </FormLabel>
              <FormControl>
                <MemberPicker
                  value={field.value}
                  options={clientUsers}
                  onChange={(value) =>
                    field.onChange(Array.isArray(value) ? value[0] : value)
                  }
                  placeholder={translate('form.clientPlaceholder')}
                  label={translate('form.client')}
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

        {clientContracts.length > 0 && (
          <FormField
            control={form.control}
            name="contractNumber"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-0">
                <Select
                  label={translate('form.contractNumber')}
                  options={contractOptions}
                  placeholder={translate('form.contractNumberPlaceholder')}
                  error={fieldState.error?.message}
                  {...field}
                  value={field.value || ''}
                />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="leads"
          render={({ field, fieldState }) => (
            <FormItem className="space-y-2">
              <FormLabel>
                {translate('form.leads')}
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
                  placeholder={translate('form.leadsPlaceholder')}
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
          name="projectManagers"
          render={({ field, fieldState }) => (
            <FormItem className="space-y-2">
              <FormLabel>{translate('form.projectManagers')}</FormLabel>
              <FormControl>
                <MemberPicker
                  value={field.value}
                  options={pmUsers}
                  multiple
                  onChange={(value) =>
                    field.onChange(Array.isArray(value) ? value : [value])
                  }
                  placeholder={translate('form.projectManagersPlaceholder')}
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
          name="members"
          render={({ field, fieldState }) => (
            <FormItem className="space-y-2">
              <FormLabel>{translate('form.members')}</FormLabel>
              <FormControl>
                <MemberPicker
                  value={field.value}
                  options={developerUsers}
                  multiple
                  onChange={(value) =>
                    field.onChange(Array.isArray(value) ? value : [value])
                  }
                  placeholder={translate('form.membersPlaceholder')}
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
                label={translate('form.priority')}
                options={priorityOptions}
                placeholder={translate('form.priorityPlaceholder')}
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
                  label={translate('form.startDate')}
                  placeholder={translate('form.startDatePlaceholder')}
                  value={field.value || undefined}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  locale={language}
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
                  label={translate('form.dueDate')}
                  placeholder={translate('form.dueDatePlaceholder')}
                  value={field.value || undefined}
                  onChange={field.onChange}
                  error={fieldState.error?.message}
                  locale={language}
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
