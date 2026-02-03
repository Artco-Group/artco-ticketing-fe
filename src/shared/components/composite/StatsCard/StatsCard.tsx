import { cn } from '@/lib/utils';
import { Icon, type IconName } from '@/shared/components/ui';

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface StatsCardProps {
  label: string;
  value: string | number;
  trend?: TrendDirection;
  trendValue?: string;
  trendLabel?: string;
  className?: string;
}

export function StatsCard({
  label,
  value,
  trend,
  trendValue,
  trendLabel,
  className,
}: StatsCardProps) {
  const showTrend = trend && trendValue;
  const trendIcon: IconName | null =
    trend === 'up' ? 'trend-up' : trend === 'down' ? 'trend-down' : null;

  return (
    <div
      className={cn(
        'bg-background border-border-default flex flex-col gap-3 rounded-lg border px-5 py-4',
        className
      )}
    >
      <p className="text-greyscale-600 text-sm font-medium">{label}</p>

      <span className="text-greyscale-900 text-4xl font-semibold">{value}</span>

      {showTrend && (
        <div className="flex items-center gap-1">
          {trendIcon && <Icon name={trendIcon} size="sm" />}
          <span
            className={cn(
              'text-sm font-medium',
              trend === 'up' && 'text-green-600',
              trend === 'down' && 'text-red-600',
              trend === 'neutral' && 'text-greyscale-500'
            )}
          >
            {trendValue}
          </span>
          {trendLabel && (
            <span className="text-greyscale-500 text-sm">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
