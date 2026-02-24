import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  passwordResetFormSchema,
  type PasswordResetFormInput,
} from '@artco-group/artco-ticketing-sync';
import { useVerifyResetToken, useResetPassword } from '../api/auth-api';
import { PAGE_ROUTES } from '@/shared/constants';
import { extractAuthError } from '../utils/extract-auth-error';
import { useTranslatedToast } from '@/shared/hooks';
import { useToast } from '@/shared/components/ui';

export function usePasswordResetForm() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const translatedToast = useTranslatedToast();
  const toast = useToast();

  const verifyTokenQuery = useVerifyResetToken(token);
  const resetPasswordMutation = useResetPassword();

  const [success, setSuccess] = useState(false);

  const form = useForm<PasswordResetFormInput>({
    resolver: zodResolver(passwordResetFormSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const tokenError = useMemo(() => {
    if (!token) {
      return 'No reset token provided. Please use the link from your email.';
    }
    if (verifyTokenQuery.isError) {
      return (
        extractAuthError(verifyTokenQuery.error) ||
        'This password reset link is invalid or has expired.'
      );
    }
    if (verifyTokenQuery.data && !verifyTokenQuery.data.valid) {
      return 'This password reset link is invalid or has expired.';
    }
    return '';
  }, [
    token,
    verifyTokenQuery.isError,
    verifyTokenQuery.data,
    verifyTokenQuery.error,
  ]);

  const verifyingToken = !!token && verifyTokenQuery.isLoading;

  const tokenValid = !!token && verifyTokenQuery.data?.valid === true;

  const onSubmit = async (data: PasswordResetFormInput) => {
    try {
      await resetPasswordMutation.mutateAsync({
        token: token || '',
        newPassword: data.newPassword,
      });
      setSuccess(true);
      translatedToast.success('toast.success.passwordReset');
      setTimeout(() => {
        navigate(PAGE_ROUTES.AUTH.LOGIN);
      }, 3000);
    } catch (err) {
      toast.error(extractAuthError(err));
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending: resetPasswordMutation.isPending,
    verifyingToken,
    tokenValid,
    tokenError,
    success,
    navigateToLogin: () => navigate(PAGE_ROUTES.AUTH.LOGIN),
  };
}
