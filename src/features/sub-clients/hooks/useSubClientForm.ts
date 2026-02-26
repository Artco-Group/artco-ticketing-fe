import { useForm, useWatch, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createSubClientSchema,
  updateSubClientSchema,
  type CreateSubClientFormData,
  type UpdateSubClientFormData,
} from '@artco-group/artco-ticketing-sync';

interface UseSubClientFormOptions {
  defaultValues?: Partial<CreateSubClientFormData>;
  isEditing?: boolean;
  onSubmit: (data: CreateSubClientFormData | UpdateSubClientFormData) => void;
}

export function useSubClientForm({
  defaultValues,
  isEditing = false,
  onSubmit,
}: UseSubClientFormOptions) {
  const schema = isEditing ? updateSubClientSchema : createSubClientSchema;

  const form = useForm<CreateSubClientFormData>({
    resolver: zodResolver(schema) as Resolver<CreateSubClientFormData>,
    defaultValues: {
      name: defaultValues?.name || '',
      email: defaultValues?.email || '',
      assignedProjects: defaultValues?.assignedProjects || [],
    },
  });

  const selectedProjectIds =
    useWatch({ control: form.control, name: 'assignedProjects' }) || [];

  const handleFormSubmit = (data: CreateSubClientFormData) => {
    onSubmit(data as CreateSubClientFormData | UpdateSubClientFormData);
  };

  return {
    form,
    selectedProjectIds,
    onSubmit: form.handleSubmit(handleFormSubmit),
  };
}
