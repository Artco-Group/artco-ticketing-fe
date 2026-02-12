import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '@artco-group/artco-ticketing-sync';
import { useChangePassword } from '../api';
import { PAGE_ROUTES } from '@/shared/constants';

export function useChangePasswordForm() {
  const navigate = useNavigate();
  const changePassword = useChangePassword();
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setFormError(null);
    try {
      await changePassword.mutateAsync(data);
      setSuccess(true);
      setTimeout(() => {
        navigate(PAGE_ROUTES.DASHBOARD.ROOT, { replace: true });
      }, 2000);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to change password';
      setFormError(message);
    }
  });

  return {
    form,
    onSubmit,
    isPending: changePassword.isPending,
    formError,
    success,
  };
}
