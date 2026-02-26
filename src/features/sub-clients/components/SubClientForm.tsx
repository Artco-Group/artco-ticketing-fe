import type {
  CreateSubClientFormData,
  UpdateSubClientFormData,
} from '@artco-group/artco-ticketing-sync';
import type { Project } from '@/types';
import { Form, FormField, FormItem, Input } from '@/shared/components/ui';
import { ProjectPicker } from '@/shared/components/composite';
import { useSubClientForm } from '../hooks/useSubClientForm';
import { useAppTranslation } from '@/shared/hooks';

interface SubClientFormProps {
  formId: string;
  onSubmit: (data: CreateSubClientFormData | UpdateSubClientFormData) => void;
  defaultValues?: Partial<CreateSubClientFormData>;
  isEditing?: boolean;
  isSubmitting?: boolean;
  parentProjects: Project[];
}

export function SubClientForm({
  formId,
  onSubmit,
  defaultValues,
  isEditing = false,
  isSubmitting = false,
  parentProjects,
}: SubClientFormProps) {
  const { translate } = useAppTranslation('subClients');
  const {
    form,
    selectedProjectIds,
    onSubmit: handleSubmit,
  } = useSubClientForm({ defaultValues, isEditing, onSubmit });

  const projectOptions = parentProjects.map((p) => ({
    id: p.id || p.slug || '',
    name: p.name,
  }));

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
                autoComplete="name"
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
          name="email"
          render={({ field, fieldState }) => (
            <FormItem className="space-y-0">
              <Input
                label={translate('form.email')}
                autoComplete="email"
                placeholder={translate('form.emailPlaceholder')}
                error={fieldState.error?.message}
                required
                {...field}
              />
            </FormItem>
          )}
        />

        {projectOptions.length > 0 && (
          <ProjectPicker
            label={translate('form.assignProjects')}
            value={selectedProjectIds}
            options={projectOptions}
            onChange={(value) => form.setValue('assignedProjects', value)}
            placeholder={translate('form.selectProjects')}
            disabled={isSubmitting}
          />
        )}

        {!isEditing && (
          <div className="bg-muted/50 rounded-md p-3">
            <p className="text-muted-foreground text-sm">
              {translate('form.passwordInfo')}
            </p>
          </div>
        )}
      </form>
    </Form>
  );
}
