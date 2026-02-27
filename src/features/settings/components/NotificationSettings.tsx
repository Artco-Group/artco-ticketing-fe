import type { ReactNode } from 'react';
import { useAppTranslation } from '@/shared/hooks';
import { Switch } from '@/shared/components/ui';
import { useAuth } from '@/features/auth/context';
import { useNotificationPreferences } from '../hooks/useNotificationPreferences';
import {
  isClientRole,
  isEngLeadRole,
} from '@artco-group/artco-ticketing-sync/enums';
import type { EmailNotificationPreferences } from '@artco-group/artco-ticketing-sync';

interface NotificationToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

function NotificationToggle({
  label,
  description,
  checked,
  disabled,
  onChange,
}: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {description && (
          <p className="mt-0.5 text-xs text-gray-500">{description}</p>
        )}
      </div>
      <Switch checked={checked} disabled={disabled} onChange={onChange} />
    </div>
  );
}

interface NotificationSectionProps {
  title: string;
  children: ReactNode;
}

function NotificationSection({ title, children }: NotificationSectionProps) {
  return (
    <div className="border-t border-gray-100 pt-4">
      <h3 className="mb-2 text-sm font-semibold text-gray-900">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

export function NotificationSettings() {
  const { translate } = useAppTranslation('settings');
  const { user } = useAuth();
  const { preferences, isUpdating, updatePreference, toggleMasterSwitch } =
    useNotificationPreferences();

  const userRole = user?.role ?? '';
  const isClient = isClientRole(userRole);
  const isEngLead = isEngLeadRole(userRole);

  const handleToggle = (
    key: keyof EmailNotificationPreferences,
    value: boolean
  ) => {
    updatePreference(key, value);
  };

  const masterDisabled = !preferences.enabled;

  return (
    <div className="mx-auto w-full max-w-[540px]">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {translate('notifications.title')}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {translate('notifications.description')}
        </p>
      </div>

      <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
        {/* Master Toggle */}
        <div className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-900">
                {translate('notifications.email.title')}
              </h2>
              <p className="mt-0.5 text-sm text-gray-500">
                {translate('notifications.email.masterToggleDescription')}
              </p>
            </div>
            <Switch
              checked={preferences.enabled}
              disabled={isUpdating}
              onChange={(checked) => toggleMasterSwitch(checked)}
            />
          </div>
        </div>

        {/* Project Notifications */}
        <NotificationSection
          title={translate('notifications.email.sections.project')}
        >
          {isClient && (
            <NotificationToggle
              label={translate('notifications.email.projectCreated')}
              checked={preferences.projectCreated}
              disabled={masterDisabled || isUpdating}
              onChange={(checked) => handleToggle('projectCreated', checked)}
            />
          )}
          <NotificationToggle
            label={translate('notifications.email.addedToProject')}
            checked={preferences.addedToProject}
            disabled={masterDisabled || isUpdating}
            onChange={(checked) => handleToggle('addedToProject', checked)}
          />
          <NotificationToggle
            label={translate('notifications.email.removedFromProject')}
            checked={preferences.removedFromProject}
            disabled={masterDisabled || isUpdating}
            onChange={(checked) => handleToggle('removedFromProject', checked)}
          />
          <NotificationToggle
            label={translate('notifications.email.projectUpdated')}
            checked={preferences.projectUpdated}
            disabled={masterDisabled || isUpdating}
            onChange={(checked) => handleToggle('projectUpdated', checked)}
          />
        </NotificationSection>

        {/* Ticket Notifications */}
        <NotificationSection
          title={translate('notifications.email.sections.ticket')}
        >
          {isEngLead && (
            <NotificationToggle
              label={translate('notifications.email.ticketCreated')}
              checked={preferences.ticketCreated}
              disabled={masterDisabled || isUpdating}
              onChange={(checked) => handleToggle('ticketCreated', checked)}
            />
          )}
          <NotificationToggle
            label={translate('notifications.email.ticketAssigned')}
            checked={preferences.ticketAssigned}
            disabled={masterDisabled || isUpdating}
            onChange={(checked) => handleToggle('ticketAssigned', checked)}
          />
          <NotificationToggle
            label={translate('notifications.email.ticketStatusChanged')}
            checked={preferences.ticketStatusChanged}
            disabled={masterDisabled || isUpdating}
            onChange={(checked) => handleToggle('ticketStatusChanged', checked)}
          />
          <NotificationToggle
            label={translate('notifications.email.ticketUpdated')}
            checked={preferences.ticketUpdated}
            disabled={masterDisabled || isUpdating}
            onChange={(checked) => handleToggle('ticketUpdated', checked)}
          />
          <NotificationToggle
            label={translate('notifications.email.commentAdded')}
            checked={preferences.commentAdded}
            disabled={masterDisabled || isUpdating}
            onChange={(checked) => handleToggle('commentAdded', checked)}
          />
        </NotificationSection>

        {/* Reminders */}
        <NotificationSection
          title={translate('notifications.email.sections.reminders')}
        >
          <NotificationToggle
            label={translate('notifications.email.dueDateReminder')}
            checked={preferences.dueDateReminder}
            disabled={masterDisabled || isUpdating}
            onChange={(checked) => handleToggle('dueDateReminder', checked)}
          />
          <NotificationToggle
            label={translate('notifications.email.ticketOverdue')}
            checked={preferences.ticketOverdue}
            disabled={masterDisabled || isUpdating}
            onChange={(checked) => handleToggle('ticketOverdue', checked)}
          />
        </NotificationSection>
      </div>
    </div>
  );
}
