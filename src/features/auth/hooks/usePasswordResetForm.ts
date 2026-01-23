import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { useVerifyResetToken, useResetPassword } from '../api/auth-api';
import { PAGE_ROUTES } from '@/shared/constants';
import { extractAuthError } from '../utils/extract-auth-error';

// Local password reset form schema (matches sync package)
const passwordResetFormSchema = z
  .object({
    newPassword: z.string().min(6, 'Lozinka mora imati najmanje 6 karaktera'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Lozinke se ne poklapaju',
    path: ['confirmPassword'],
  });

type PasswordResetFormData = z.infer<typeof passwordResetFormSchema>;

/**
 * Custom hook for password reset form logic.
 * Separates business logic from UI for better testability and maintainability.
 */
export function usePasswordResetForm() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const verifyTokenQuery = useVerifyResetToken(token);
  const resetPasswordMutation = useResetPassword();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  const form = useForm<PasswordResetFormData>({
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
  }, [tokenError]);

  const onSubmit = async (data: PasswordResetFormData) => {
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
