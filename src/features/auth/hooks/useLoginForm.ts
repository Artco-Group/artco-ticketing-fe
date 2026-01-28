import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  loginSchema,
  type LoginFormData,
} from '@artco-group/artco-ticketing-sync';
import { useLogin } from '../api/auth-api';
import { useAuth } from '../context';
import { PAGE_ROUTES } from '@/shared/constants';
import { extractAuthError } from '../utils/extract-auth-error';
import { useToast } from '@/shared/components/ui';

/**
 * Custom hook for login form logic.
 * Separates business logic from UI for better testability and maintainability.
 */
export function useLoginForm() {
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect to dashboard when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(PAGE_ROUTES.DASHBOARD.ROOT, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      toast.success({ title: 'Successfully logged in' });
    } catch (err) {
      toast.error({ title: extractAuthError(err), icon: 'info' });
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending: loginMutation.isPending,
    showPassword,
    togglePassword: () => setShowPassword((prev) => !prev),
  };
}
