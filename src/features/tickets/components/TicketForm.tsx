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
import { useAppTranslation } from '@/shared/hooks';
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
  engLeadUsers?: User[];
  canAssign?: boolean;
  canSetSolutionDates?: boolean;
}

export function TicketForm({
  form,
  formId,
  onSubmit,
  isEditing = false,
  projectOptions,
  isProjectLocked = false,
  developerUsers = [],
  engLeadUsers = [],
  canAssign = false,
  canSetSolutionDates = false,
}: TicketFormProps) {
  const { translate, language } = useAppTranslation('tickets');
  const category = form.watch('category');
  const isBug = category === TicketCategory.BUG;
  const hasNoProjects = projectOptions.length === 0;

  return (
    <Form {...form}>
      <form id={formId} onSubmit={onSubmit} className="space-y-5">
        <FormField
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <FormItem className="space-y-0">
              <Input
                label={translate('form.title')}
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
                label={translate('form.description')}
                placeholder={translate('form.descriptionPlaceholder')}
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
                    label={translate('form.category')}
                    options={CATEGORY_FORM_OPTIONS}
                    placeholder={translate('form.categoryPlaceholder')}
                    error={fieldState.error?.message}
                    required
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
                    label={translate('form.priority')}
                    options={PRIORITY_FORM_OPTIONS}
                    placeholder={translate('form.priorityPlaceholder')}
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
                  label={translate('form.project')}
                  options={projectOptions}
                  placeholder={translate('form.projectPlaceholder')}
                  error={fieldState.error?.message}
                  helperText={
                    hasNoProjects ? translate('form.noProjectsHint') : undefined
                  }
                  disabled={isProjectLocked || hasNoProjects}
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
                label={translate('form.affectedModule')}
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
                <FormLabel>{translate('form.assignee')}</FormLabel>
                <FormControl>
                  <MemberPicker
                    value={field.value || ''}
                    options={developerUsers}
                    onChange={(value) =>
                      field.onChange(Array.isArray(value) ? value[0] : value)
                    }
                    placeholder={translate('form.assigneePlaceholder')}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {engLeadUsers.length > 0 && !isEditing && (
          <FormField
            control={form.control}
            name="engLead"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>{translate('form.engLead')}</FormLabel>
                <FormControl>
                  <MemberPicker
                    value={field.value || ''}
                    options={engLeadUsers}
                    onChange={(value) =>
                      field.onChange(Array.isArray(value) ? value[0] : value)
                    }
                    placeholder={translate('form.engLeadPlaceholder')}
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
                    label={translate('form.startDate')}
                    value={field.value}
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
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                    locale={language}
                  />
                </FormItem>
              )}
            />
          </div>
        )}
        {!isEditing && canSetSolutionDates && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="tempSolutionDate"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-0">
                  <DatePicker
                    label={translate('form.tempSolutionDate')}
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                    locale={language}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="finalSolutionDate"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-0">
                  <DatePicker
                    label={translate('form.finalSolutionDate')}
                    value={field.value}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                    locale={language}
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
                    label={translate('form.reproductionSteps')}
                    placeholder={translate('form.reproductionStepsPlaceholder')}
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
                    label={translate('form.expectedResult')}
                    placeholder={translate('form.expectedResultPlaceholder')}
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
                    label={translate('form.actualResult')}
                    placeholder={translate('form.actualResultPlaceholder')}
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
