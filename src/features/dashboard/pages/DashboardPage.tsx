import { useAuth } from '@/features/auth/context';
import { PageHeader, ActivityFeed } from '@/shared/components/patterns';
import { useActivities } from '../api/activities-api';
import { QueryStateWrapper } from '@/shared/components/ui/QueryStateWrapper';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, error, refetch, isRefetching } = useActivities(20);

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="flex h-full flex-col">
      <PageHeader title={`Welcome back, ${firstName}!`} />

      <div className="flex-1 overflow-auto">
        <div className="px-6 py-4">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
          <p className="mb-4 text-sm text-gray-500">
            Here's what's been happening recently
          </p>

          <QueryStateWrapper
            isLoading={isLoading}
            error={error}
            data={data}
            allowEmpty
            loadingMessage="Loading activities..."
            errorMessage="Failed to load activities"
            onRetry={refetch}
            isRefetching={isRefetching}
          >
            {(activityData) => (
              <ActivityFeed
                activities={activityData.activities}
                maxItems={15}
                emptyMessage="No recent activity. Activities will appear here as you work on tickets and projects."
                currentUserId={user?.id}
                variant="timeline"
              />
            )}
          </QueryStateWrapper>
        </div>
      </div>
    </div>
  );
}
