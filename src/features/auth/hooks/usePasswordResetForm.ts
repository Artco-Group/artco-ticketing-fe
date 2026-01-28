import { useState, useEffect, useMemo } from 'react';
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
import { useToast } from '@/shared/components/ui';

/**
 * Custom hook for password reset form logic.
 * Separates business logic from UI for better testability and maintainability.
 */
export function usePasswordResetForm() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const verifyTokenQuery = useVerifyResetToken(token);
  const resetPasswordMutation = useResetPassword();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  const form = useForm<PasswordResetFormInput>({
    resolver: zodResolver(passwordResetFormSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Calculate token verification error from query
  const tokenError = useMemo(() => {
    if (verifyTokenQuery.isError) {
      return (
        extractAuthError(verifyTokenQuery.error) ||
        'Token je nevažeći ili je istekao'
      );
    }
    if (verifyTokenQuery.data && !verifyTokenQuery.data.valid) {
      return (
        verifyTokenQuery.data.message || 'Token je nevažeći ili je istekao'
      );
    }
    return '';
  }, [verifyTokenQuery.isError, verifyTokenQuery.data, verifyTokenQuery.error]);

  // Show toast notification for token verification errors
  useEffect(() => {
    if (tokenError) {
      toast.error(tokenError);
    }
  }, [tokenError, toast]);

  const onSubmit = async (data: PasswordResetFormInput) => {
    setFormError('');

    try {
      await resetPasswordMutation.mutateAsync({
        token: token || '',
        newPassword: data.newPassword,
      });
      setSuccess(true);
      toast.success('Lozinka je uspješno resetovana');
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate(PAGE_ROUTES.AUTH.LOGIN);
      }, 2000);
    } catch (err) {
      const errorMsg = extractAuthError(err);
      setFormError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending: resetPasswordMutation.isPending,
    verifyingToken: verifyTokenQuery.isLoading,
    tokenValid: verifyTokenQuery.data?.valid ?? false,
    tokenError,
    formError,
    success,
    showNewPassword,
    showConfirmPassword,
    toggleNewPassword: () => setShowNewPassword((prev) => !prev),
    toggleConfirmPassword: () => setShowConfirmPassword((prev) => !prev),
    navigateToLogin: () => navigate(PAGE_ROUTES.AUTH.LOGIN),
  };
}
