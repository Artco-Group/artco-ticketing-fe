import { useParams, Navigate } from 'react-router-dom';
import { SettingsLayout } from '../components';
import { EmptyState } from '@/shared/components/ui';

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

export default function SettingsPage() {
  const { section = 'profile' } = useParams<{ section?: string }>();

  // Redirect to profile if section is invalid
  if (!validSections.includes(section)) {
    return <Navigate to="/settings/profile" replace />;
  }

  return (
    <SettingsLayout activeSection={section}>
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
