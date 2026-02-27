import { useState, useCallback, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  QueryKeys,
  API_ROUTES,
  type EmailNotificationPreferences,
} from '@artco-group/artco-ticketing-sync';
import { useAuth } from '@/features/auth/context';
import { apiClient } from '@/shared/lib/api-client';
import { useToast } from '@/shared/components/ui';
import { DEFAULT_EMAIL_NOTIFICATION_PREFERENCES } from '@artco-group/artco-ticketing-sync/constants';

export function useNotificationPreferences() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const preferences: EmailNotificationPreferences = useMemo(() => {
    return (
      user?.preferences?.emailNotifications ??
      DEFAULT_EMAIL_NOTIFICATION_PREFERENCES
    );
  }, [user?.preferences?.emailNotifications]);

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<EmailNotificationPreferences>) => {
      const response = await apiClient.patch(API_ROUTES.USERS.PREFERENCES, {
        emailNotifications: updates,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.auth.currentUser() });
    },
    onError: () => {
      toast.error('Failed to update notification preferences');
    },
  });

  const updatePreference = useCallback(
    async (key: keyof EmailNotificationPreferences, value: boolean) => {
      setIsUpdating(true);
      try {
        await updateMutation.mutateAsync({ [key]: value });
      } finally {
        setIsUpdating(false);
      }
    },
    [updateMutation]
  );

  const toggleMasterSwitch = useCallback(
    async (enabled: boolean) => {
      setIsUpdating(true);
      try {
        await updateMutation.mutateAsync({ enabled });
      } finally {
        setIsUpdating(false);
      }
    },
    [updateMutation]
  );

  return {
    preferences,
    isUpdating: isUpdating || updateMutation.isPending,
    updatePreference,
    toggleMasterSwitch,
  };
}
