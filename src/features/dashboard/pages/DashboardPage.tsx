import { useState, useCallback } from 'react';
import { useAuth } from '@/features/auth/context';
import { PageHeader, ActivityFeed } from '@/shared/components/patterns';
import { useActivities, useDashboardStats } from '../api/activities-api';
import { DashboardStats } from '../components';
import { QueryStateWrapper } from '@/shared/components/ui/QueryStateWrapper';
import { useAppTranslation } from '@/shared/hooks';

const INITIAL_VISIBLE_COUNT = 10;
const LOAD_MORE_COUNT = 10;

export default function DashboardPage() {
  const { translate } = useAppTranslation('dashboard');
  const { translate: translateCommon } = useAppTranslation('common');
  const { user } = useAuth();
  const { data, isLoading, error, refetch, isRefetching } = useActivities(50);
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const firstName = user?.name?.trim().split(' ')[0];

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
  }, []);

  const welcomeMessage = firstName
    ? translate('welcome', { name: firstName })
    : translate('welcomeNoName');

  return (
    <div className="flex h-full flex-col">
      <PageHeader title={welcomeMessage} />

      <div className="flex h-[calc(100vh-140px)] flex-col">
        <DashboardStats stats={statsData?.stats} isLoading={statsLoading} />

        <div className="border-greyscale-200 flex min-h-0 flex-1 flex-col border-t">
          <div className="border-greyscale-200 shrink-0 border-b px-6 py-4">
            <h2 className="text-greyscale-900 text-base font-semibold">
              {translate('recentActivity.title')}
            </h2>
            <p className="text-greyscale-500 text-xs">
              {translate('recentActivity.description')}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <QueryStateWrapper
              isLoading={isLoading}
              error={error}
              data={data}
              allowEmpty
              loadingMessage={translateCommon('messages.loadingActivities')}
              errorMessage={translateCommon('messages.failedToLoadActivities')}
              onRetry={refetch}
              isRefetching={isRefetching}
            >
              {(activityData) => {
                const totalActivities = activityData.activities.length;
                const hasMore = visibleCount < totalActivities;

                return (
                  <ActivityFeed
                    activities={activityData.activities}
                    maxItems={visibleCount}
                    emptyMessage={`${translate('recentActivity.empty')}. ${translate('recentActivity.emptyDescription')}`}
                    currentUserId={user?.id}
                    variant="list"
                    onLoadMore={hasMore ? handleLoadMore : undefined}
                    hasMore={hasMore}
                  />
                );
              }}
            </QueryStateWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}
