import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '@artco-group/artco-ticketing-sync';
import { useChangePassword } from '../api';
import { getErrorMessage } from '@/shared';
import { PAGE_ROUTES } from '@/shared/constants';

interface UseChangePasswordFormOptions {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function useChangePasswordForm(
  options: UseChangePasswordFormOptions = {}
) {
  const navigate = useNavigate();
  const changePassword = useChangePassword();
  const [success, setSuccess] = useState(false);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const watchedFields = useWatch({
    control: form.control,
    name: ['currentPassword', 'newPassword', 'confirmPassword'],
  });
  const allFieldsFilled = watchedFields.every(Boolean);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await changePassword.mutateAsync(data);
      setSuccess(true);
      if (options.onSuccess) {
        options.onSuccess();
      } else {
        setTimeout(() => {
          navigate(PAGE_ROUTES.DASHBOARD.ROOT, { replace: true });
        }, 2000);
      }
    } catch (error) {
      const message = getErrorMessage(error);
      options.onError?.(message);
    }
  });

  const resetForm = () => {
    form.reset();
  };

  return {
    form,
    onSubmit,
    resetForm,
    isPending: changePassword.isPending,
    isDirty: form.formState.isDirty,
    allFieldsFilled,
    success,
  };
}
