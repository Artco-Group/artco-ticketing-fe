import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormData,
  type UpdateUserFormData,
  UserRole,
} from '@artco-group/artco-ticketing-sync';

interface UseUserFormOptions {
  defaultValues?: Partial<CreateUserFormData>;
  isEditing?: boolean;
  onSubmit: (data: CreateUserFormData | UpdateUserFormData) => void;
}

export function useUserForm({
  defaultValues,
  isEditing = false,
  onSubmit,
}: UseUserFormOptions) {
  const schema = isEditing ? updateUserSchema : createUserSchema;

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(schema) as Resolver<CreateUserFormData>,
    defaultValues: {
      name: defaultValues?.name || '',
      email: defaultValues?.email || '',
      role: defaultValues?.role || UserRole.CLIENT,
      password: '',
    },
  });

  const handleFormSubmit = (data: CreateUserFormData) => {
    if (isEditing) {
      const { password: _, ...updateData } = data;
      onSubmit(updateData as UpdateUserFormData);
    } else {
      onSubmit(data);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(handleFormSubmit),
  };
}
