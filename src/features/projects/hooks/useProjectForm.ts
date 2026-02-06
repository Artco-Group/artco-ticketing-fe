import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createProjectSchema,
  updateProjectSchema,
  type CreateProjectFormData,
  type UpdateProjectFormData,
  ProjectPriority,
} from '@artco-group/artco-ticketing-sync';

interface UseProjectFormOptions {
  defaultValues?: Partial<CreateProjectFormData>;
  isEditing?: boolean;
  onSubmit: (data: CreateProjectFormData | UpdateProjectFormData) => void;
}

export function useProjectForm({
  defaultValues,
  isEditing = false,
  onSubmit,
}: UseProjectFormOptions) {
  const schema = isEditing ? updateProjectSchema : createProjectSchema;

  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(schema) as Resolver<CreateProjectFormData>,
    defaultValues: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || '',
      client: defaultValues?.client || '',
      leads: defaultValues?.leads || [],
      members: defaultValues?.members || [],
      startDate: defaultValues?.startDate || '',
      dueDate: defaultValues?.dueDate || '',
      priority: defaultValues?.priority || ProjectPriority.MEDIUM,
    },
  });

  const handleFormSubmit = (data: CreateProjectFormData) => {
    // Convert empty strings to undefined for optional fields
    const cleanData = {
      ...data,
      description: data.description || undefined,
      startDate: data.startDate || undefined,
      members: data.members || [],
    };

    if (isEditing) {
      onSubmit(cleanData as UpdateProjectFormData);
    } else {
      onSubmit(cleanData);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(handleFormSubmit),
  };
}
