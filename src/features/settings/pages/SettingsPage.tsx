import { useParams, Navigate } from 'react-router-dom';
import { SettingsLayout } from '../components';
import { EmptyState } from '@/shared/components/ui';
import type { SettingsSideBarGroup } from '../components/SettingsSidebar';

const validSections = [
  'profile',
  'notification',
  'security',
  'connected-account',
  'integrations',
  'preference',
  'billing',
  'application',
  'import-export',
  'api',
];

const settingsGroups: SettingsSideBarGroup[] = [
  {
    title: 'Account',
    items: [
      {
        id: 'profile',
        label: 'Profile',
        icon: 'profile',
        href: '/settings/profile',
      },
      {
        id: 'notification',
        label: 'Notification',
        icon: 'notification',
        href: '/settings/notification',
      },
      {
        id: 'security',
        label: 'Security & Access',
        icon: 'security',
        href: '/settings/security',
      },
      {
        id: 'connected-account',
        label: 'Connected Account',
        icon: 'connected-account',
        href: '/settings/connected-account',
      },
      {
        id: 'integrations',
        label: 'Integrations',
        icon: 'integrations',
        href: '/settings/integrations',
      },
    ],
  },
  {
    title: 'Administration',
    items: [
      {
        id: 'preference',
        label: 'Preference',
        icon: 'preference',
        href: '/settings/preference',
      },
      {
        id: 'billing',
        label: 'Billing',
        icon: 'billing',
        href: '/settings/billing',
      },
      {
        id: 'application',
        label: 'Application',
        icon: 'application',
        href: '/settings/application',
      },
      {
        id: 'import-export',
        label: 'Import / Export',
        icon: 'import-export',
        href: '/settings/import-export',
      },
      { id: 'api', label: 'API', icon: 'api', href: '/settings/api' },
    ],
  },
];

export default function SettingsPage() {
  const { section = 'profile' } = useParams<{ section?: string }>();

  // Redirect to profile if section is invalid
  if (!validSections.includes(section)) {
    return <Navigate to="/settings/profile" replace />;
  }

  return (
    <SettingsLayout activeSection={section} groups={settingsGroups}>
      <div className="flex justify-center py-12">
        <EmptyState
          variant="no-data"
          title={`${section.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} Settings`}
          message={`${section.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} settings will be available here.`}
        />
      </div>
    </SettingsLayout>
  );
}
