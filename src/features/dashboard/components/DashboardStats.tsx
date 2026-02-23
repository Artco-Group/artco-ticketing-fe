import { type DashboardStatsData } from '@artco-group/artco-ticketing-sync';
import { StatsCard } from '@/shared/components/composite/StatsCard';
import { useAppTranslation } from '@/shared/hooks';
import {
  statConfig,
  defaultStatConfig,
} from '../config/dashboard-stats.config';

interface DashboardStatsProps {
  stats: DashboardStatsData | undefined;
  isLoading: boolean;
}

function StatsCardSkeleton() {
  return (
    <div className="bg-background border-greyscale-200 flex animate-pulse items-start gap-4 border-r border-b px-5 py-4 first:border-l lg:first:border-l-0">
      <div className="h-11 w-11 shrink-0 rounded-lg bg-gray-200" />
      <div className="flex flex-col gap-2">
        <div className="h-4 w-20 rounded bg-gray-200" />
        <div className="h-8 w-16 rounded bg-gray-200" />
      </div>
    </div>
  );
}

export function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  const { translate } = useAppTranslation('dashboard');

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const config = statConfig[stat.label] || defaultStatConfig;
        return (
          <StatsCard
            key={index}
            label={translate(`stats.${stat.label}`)}
            value={stat.value}
            icon={config.icon}
            colorVariant={config.color}
            href={config.href}
          />
        );
      })}
    </div>
  );
}
