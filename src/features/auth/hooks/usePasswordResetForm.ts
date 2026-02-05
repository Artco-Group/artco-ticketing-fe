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
    // No token provided in URL
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

  // Determine if we're still verifying (only if we have a token)
  const verifyingToken = !!token && verifyTokenQuery.isLoading;

  // Token is valid only if query succeeded and returned valid: true
  const tokenValid = !!token && verifyTokenQuery.data?.valid === true;

  const onSubmit = async (data: PasswordResetFormInput) => {
    setFormError('');

    try {
      await resetPasswordMutation.mutateAsync({
        token: token || '',
        newPassword: data.newPassword,
      });
      setSuccess(true);
      toast.success('Password reset successfully');
      setTimeout(() => {
        navigate(PAGE_ROUTES.AUTH.LOGIN);
      }, 3000);
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
    verifyingToken,
    tokenValid,
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
