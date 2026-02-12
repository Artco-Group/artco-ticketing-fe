import { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormData,
  type UpdateUserFormData,
} from '@artco-group/artco-ticketing-sync';
import { UserRole } from '@/types';

interface UseUserFormOptions {
  defaultValues?: Partial<CreateUserFormData>;
  isEditing?: boolean;
  onSubmit: (
    data: CreateUserFormData | UpdateUserFormData,
    projectIds?: string[],
    avatarFile?: File
  ) => void;
  initialProjectIds?: string[];
  isClient?: boolean;
}

export function useUserForm({
  defaultValues,
  isEditing = false,
  onSubmit,
  initialProjectIds = [],
  isClient = false,
}: UseUserFormOptions) {
  const schema = isEditing ? updateUserSchema : createUserSchema;
  const [selectedProjectIds, setSelectedProjectIds] =
    useState<string[]>(initialProjectIds);

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(schema) as Resolver<CreateUserFormData>,
    defaultValues: {
      name: defaultValues?.name || '',
      email: defaultValues?.email || '',
      role: isClient
        ? UserRole.CLIENT
        : defaultValues?.role || UserRole.DEVELOPER,
    },
  });

  const createSubmitHandler = (avatarFile?: File | null) => {
    return form.handleSubmit((data: CreateUserFormData) => {
      onSubmit(data, selectedProjectIds, avatarFile || undefined);
    });
  };

  return {
    form,
    selectedProjectIds,
    setSelectedProjectIds,
    createSubmitHandler,
  };
}
