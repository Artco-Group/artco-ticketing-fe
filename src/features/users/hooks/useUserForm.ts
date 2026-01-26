import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createUserSchema,
  type CreateUserFormData,
  type UpdateUserFormData,
} from '@artco-group/artco-ticketing-sync';
import { UserRole } from '@/types';

interface UseUserFormOptions {
  defaultValues?: Partial<CreateUserFormData>;
  isEditing?: boolean;
  onSubmit: (data: CreateUserFormData | UpdateUserFormData) => void;
}

/**
 * Custom hook for user form logic.
 * Separates business logic from UI for better testability and maintainability.
 */
export function useUserForm({
  defaultValues,
  isEditing = false,
  onSubmit,
}: UseUserFormOptions) {
  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      email: defaultValues?.email || '',
      role: defaultValues?.role || UserRole.CLIENT,
      password: '',
    },
  });

  const handleFormSubmit = (data: CreateUserFormData) => {
    if (isEditing) {
      const updateData: UpdateUserFormData = {
        name: data.name,
        email: data.email,
        role: data.role,
      };
      onSubmit(updateData);
    } else {
      onSubmit(data);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(handleFormSubmit),
    isEditing,
  };
}
