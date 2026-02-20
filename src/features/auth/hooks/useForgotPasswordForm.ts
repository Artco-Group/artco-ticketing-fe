import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from '@artco-group/artco-ticketing-sync';
import { useForgotPassword } from '../api/auth-api';
import { PAGE_ROUTES } from '@/shared/constants';
import { extractAuthError } from '../utils/extract-auth-error';
import { useTranslatedToast } from '@/shared/hooks';
import { useToast } from '@/shared/components/ui';

export function useForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPassword();
  const navigate = useNavigate();
  const translatedToast = useTranslatedToast();
  const toast = useToast();

  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError('');
    setSuccess(false);

    try {
      await forgotPasswordMutation.mutateAsync(data);
      setSuccess(true);
      translatedToast.success('toast.success.emailSent');
      navigate(PAGE_ROUTES.AUTH.CHECK_EMAIL, { state: { email: data.email } });
    } catch (err) {
      const errorMessage = extractAuthError(err);
      setServerError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending: forgotPasswordMutation.isPending,
    serverError,
    success,
  };
}
