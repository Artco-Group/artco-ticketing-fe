import { useState, useCallback, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  QueryKeys,
  type EmailNotificationPreferences,
} from '@artco-group/artco-ticketing-sync';
import { useAuth } from '@/features/auth/context';
import { apiClient } from '@/shared/lib/api-client';
import { useToast } from '@/shared/components/ui';
import { DEFAULT_EMAIL_NOTIFICATION_PREFERENCES } from '@artco-group/artco-ticketing-sync/constants';

export function useNotificationPreferences() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  // Get current preferences or defaults
  const preferences: EmailNotificationPreferences = useMemo(() => {
    return (
      user?.preferences?.emailNotifications ??
      DEFAULT_EMAIL_NOTIFICATION_PREFERENCES
    );
  }, [user?.preferences?.emailNotifications]);

  // Mutation for updating preferences
  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<EmailNotificationPreferences>) => {
      const response = await apiClient.patch('/users/me/preferences', {
        emailNotifications: updates,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.auth.currentUser() });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update notification preferences',
      });
    },
  });

  // Update a single preference
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

  // Toggle the master switch
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
