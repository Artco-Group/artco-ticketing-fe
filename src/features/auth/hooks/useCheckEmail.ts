import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useForgotPassword } from '../api/auth-api';
import { useToast } from '@/shared/components/ui';
import { extractAuthError } from '../utils/extract-auth-error';

interface CheckEmailLocationState {
  email?: string;
}

const COOLDOWN_SECONDS = 60;

/**
 * Custom hook for check email page logic.
 * Handles resend email functionality with cooldown timer.
 */
export function useCheckEmail() {
  const location = useLocation();
  const state = location.state as CheckEmailLocationState | null;
  const email = state?.email ?? '';

  const forgotPasswordMutation = useForgotPassword();
  const toast = useToast();

  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = useCallback(async () => {
    if (!email) {
      toast.error('Email address not found');
      return;
    }

    if (cooldown > 0) return;

    setIsResending(true);

    try {
      await forgotPasswordMutation.mutateAsync({ email });
      setCooldown(COOLDOWN_SECONDS);
      toast.success('Email resent successfully');
    } catch (err) {
      toast.error(extractAuthError(err));
    } finally {
      setIsResending(false);
    }
  }, [email, cooldown, forgotPasswordMutation, toast]);

  return {
    email,
    isResending,
    cooldown,
    handleResend,
    canResend: cooldown === 0 && !!email,
  };
}
