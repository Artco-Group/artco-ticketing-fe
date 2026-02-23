import { useParams, useLocation, Navigate } from 'react-router-dom';
import { useAppTranslation } from '@/shared/hooks';
import {
  SettingsLayout,
  ProfileSettings,
  SecuritySettings,
  PreferenceSettings,
  NotificationSettings,
} from '../components';
import { StatusConfigsSettings } from '@/features/status-configs/components';
import { StatusConfigEditorPage } from '@/features/status-configs/pages';
import { EmptyState } from '@/shared/components/ui';
import { PAGE_ROUTES } from '@/shared/constants/routes.constants';
import type { SettingsSideBarGroup } from '../components/SettingsSidebar';
import {
  SETTINGS_GROUPS_CONFIG,
  VALID_SETTINGS_SECTIONS,
} from '../utils/settings-config';

export default function SettingsPage() {
  const { section = 'profile' } = useParams<{ section?: string }>();
  const location = useLocation();
  const { translate } = useAppTranslation('settings');

  const isWorkflowNew =
    location.pathname === PAGE_ROUTES.SETTINGS.WORKFLOWS_NEW;
  const isWorkflowEdit =
    location.pathname.includes('/workflows/') &&
    location.pathname.endsWith('/edit');
  const isWorkflowEditor = isWorkflowNew || isWorkflowEdit;

  const settingsGroups: SettingsSideBarGroup[] = SETTINGS_GROUPS_CONFIG.map(
    (group) => ({
      title: translate(group.titleKey),
      items: group.items.map((item) => ({
        ...item,
        label: translate(item.labelKey),
      })),
    })
  );

  if (
    !isWorkflowEditor &&
    !VALID_SETTINGS_SECTIONS.includes(
      section as (typeof VALID_SETTINGS_SECTIONS)[number]
    )
  ) {
    return <Navigate to={PAGE_ROUTES.SETTINGS.PROFILE} replace />;
  }

  const renderContent = () => {
    if (isWorkflowEditor) {
      return <StatusConfigEditorPage />;
    }

    if (section === 'profile') {
      return <ProfileSettings />;
    }

    if (section === 'security') {
      return <SecuritySettings />;
    }

    if (section === 'preference') {
      return <PreferenceSettings />;
    }

    if (section === 'notification') {
      return <NotificationSettings />;
    }

    if (section === 'workflows') {
      return <StatusConfigsSettings />;
    }

    return (
      <div className="flex justify-center py-12">
        <EmptyState
          variant="no-data"
          title={`${section.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} Settings`}
          message={`${section.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} settings will be available here.`}
        />
      </div>
    );
  };

  const activeSection = isWorkflowEditor ? 'workflows' : section;

  return (
    <SettingsLayout activeSection={activeSection} groups={settingsGroups}>
      {renderContent()}
    </SettingsLayout>
  );
}
