import { useParams, Navigate } from 'react-router-dom';
import { SettingsLayout } from '../components';
import { EmptyState } from '@/shared/components/ui';
import { PAGE_ROUTES } from '@/shared/constants/routes.constants';
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
        href: PAGE_ROUTES.SETTINGS.PROFILE,
      },
      {
        id: 'notification',
        label: 'Notification',
        icon: 'notification',
        href: PAGE_ROUTES.SETTINGS.NOTIFICATION,
      },
      {
        id: 'security',
        label: 'Security & Access',
        icon: 'security',
        href: PAGE_ROUTES.SETTINGS.SECURITY,
      },
      {
        id: 'connected-account',
        label: 'Connected Account',
        icon: 'connected-account',
        href: PAGE_ROUTES.SETTINGS.CONNECTED_ACCOUNT,
      },
      {
        id: 'integrations',
        label: 'Integrations',
        icon: 'integrations',
        href: PAGE_ROUTES.SETTINGS.INTEGRATIONS,
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
        href: PAGE_ROUTES.SETTINGS.PREFERENCE,
      },
      {
        id: 'billing',
        label: 'Billing',
        icon: 'billing',
        href: PAGE_ROUTES.SETTINGS.BILLING,
      },
      {
        id: 'application',
        label: 'Application',
        icon: 'application',
        href: PAGE_ROUTES.SETTINGS.APPLICATION,
      },
      {
        id: 'import-export',
        label: 'Import / Export',
        icon: 'import-export',
        href: PAGE_ROUTES.SETTINGS.IMPORT_EXPORT,
      },
      { id: 'api', label: 'API', icon: 'api', href: PAGE_ROUTES.SETTINGS.API },
    ],
  },
];

export default function SettingsPage() {
  const { section = 'profile' } = useParams<{ section?: string }>();

  if (!validSections.includes(section)) {
    return <Navigate to={PAGE_ROUTES.SETTINGS.PROFILE} replace />;
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
