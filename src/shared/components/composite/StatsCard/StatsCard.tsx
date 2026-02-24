import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Icon, type IconName } from '@/shared/components/ui';

export type TrendDirection = 'up' | 'down' | 'neutral';
export type StatColorVariant = 'blue' | 'green' | 'purple' | 'teal' | 'orange';

const colorVariants: Record<
  StatColorVariant,
  { border: string; iconBg: string; iconText: string }
> = {
  blue: {
    border: 'border-l-blue-500',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
  },
  green: {
    border: 'border-l-green-500',
    iconBg: 'bg-green-100',
    iconText: 'text-green-600',
  },
  purple: {
    border: 'border-l-purple-500',
    iconBg: 'bg-purple-100',
    iconText: 'text-purple-600',
  },
  teal: {
    border: 'border-l-teal-500',
    iconBg: 'bg-teal-200',
    iconText: 'text-teal-700',
  },
  orange: {
    border: 'border-l-orange-500',
    iconBg: 'bg-orange-100',
    iconText: 'text-orange-700',
  },
};

export interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: IconName;
  colorVariant?: StatColorVariant;
  href?: string;
  trend?: TrendDirection;
  trendValue?: string;
  trendLabel?: string;
  className?: string;
}

export function StatsCard({
  label,
  value,
  icon,
  colorVariant = 'blue',
  href,
  trend,
  trendValue,
  trendLabel,
  className,
}: StatsCardProps) {
  const showTrend = trend && trendValue;
  const trendIcon: IconName | null =
    trend === 'up' ? 'trend-up' : trend === 'down' ? 'trend-down' : null;
  const colors = colorVariants[colorVariant];

  const cardContent = (
    <>
      {icon && (
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg',
            colors.iconBg
          )}
        >
          <Icon name={icon} size="lg" className={colors.iconText} />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <p className="text-greyscale-500 text-sm font-medium">{label}</p>
        <span className="text-greyscale-900 text-3xl font-bold">{value}</span>

        {showTrend && (
          <div className="mt-1 flex items-center gap-1">
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
    </>
  );

  const cardClassName = cn(
    'bg-background border-greyscale-200 flex items-start gap-4 border-r border-b px-5 py-4 transition-colors first:border-l lg:first:border-l-0',
    href && 'cursor-pointer hover:bg-gray-50',
    className
  );

  if (href) {
    return (
      <NavLink to={href} className={cardClassName}>
        {cardContent}
      </NavLink>
    );
  }

  return <div className={cardClassName}>{cardContent}</div>;
}
