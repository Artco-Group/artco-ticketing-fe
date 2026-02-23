import { cn } from '@/lib/utils';

export type ProgressSize = 'sm' | 'md' | 'lg' | 'xs';
export type ProgressVariant = 'circle' | 'bar';

export interface ProgressProps {
  /** Progress value from 0 to 100 */
  value: number;
  /** Size variant */
  size?: ProgressSize;
  /** Display variant: circle or bar */
  variant?: ProgressVariant;
  /** Show percentage label */
  showLabel?: boolean;
  /** Custom label (overrides percentage) */
  label?: string;
  /** Color when complete (100%) */
  completeColor?: string;
  /** Color when in progress */
  progressColor?: string;
  /** Additional class names */
  className?: string;
}

const sizeConfig = {
  xs: { circle: 24, stroke: 2, fontSize: 'text-xs' },
  sm: { circle: 32, stroke: 3, fontSize: 'text-xs' },
  md: { circle: 40, stroke: 3, fontSize: 'text-sm' },
  lg: { circle: 80, stroke: 5, fontSize: 'text-lg' },
};

/**
 * Progress component - displays progress as a circle or bar
 */
export function Progress({
  value,
  size = 'md',
  variant = 'circle',
  showLabel = true,
  label,
  completeColor = 'var(--icon-success)',
  progressColor = 'var(--icon-core)',
  className,
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, value));
  const isComplete = percentage >= 100;
  const color = isComplete ? completeColor : progressColor;

  if (variant === 'bar') {
    return (
      <div className={cn('w-full', className)}>
        <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
            }}
          />
        </div>
        {showLabel && (
          <span
            className={cn(
              'text-muted-foreground mt-1 block text-center',
              sizeConfig[size].fontSize
            )}
          >
            {label ?? `${Math.round(percentage)}%`}
          </span>
        )}
      </div>
    );
  }

  // Circle variant
  const config = sizeConfig[size];
  const radius = (config.circle - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        width={config.circle}
        height={config.circle}
        viewBox={`0 0 ${config.circle} ${config.circle}`}
        className="-rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.circle / 2}
          cy={config.circle / 2}
          r={radius}
          fill="none"
          stroke="var(--color-greyscale-200)"
          strokeWidth={config.stroke}
        />
        {/* Progress circle */}
        <circle
          cx={config.circle / 2}
          cy={config.circle / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={config.stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      {showLabel && (
        <span
          className={cn(
            'min-w-[2.5rem] font-medium',
            sizeConfig[size].fontSize
          )}
        >
          {label ?? `${Math.round(percentage)}%`}
        </span>
      )}
    </div>
  );
}

/**
 * Centered progress circle with label below
 */
export function ProgressCircle({
  value,
  size = 'md',
  showLabel = true,
  label,
  completeColor,
  progressColor,
  className,
}: Omit<ProgressProps, 'variant'>) {
  const percentage = Math.min(100, Math.max(0, value));
  const isComplete = percentage >= 100;
  const color = isComplete
    ? (completeColor ?? 'var(--icon-success)')
    : (progressColor ?? 'var(--icon-core)');
  const config = sizeConfig[size];
  const radius = (config.circle - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <svg
        width={config.circle}
        height={config.circle}
        viewBox={`0 0 ${config.circle} ${config.circle}`}
        className="-rotate-90"
      >
        <circle
          cx={config.circle / 2}
          cy={config.circle / 2}
          r={radius}
          fill="none"
          stroke="var(--color-greyscale-200)"
          strokeWidth={config.stroke}
        />
        <circle
          cx={config.circle / 2}
          cy={config.circle / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={config.stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      {showLabel && (
        <span className={cn('font-medium', sizeConfig[size].fontSize)}>
          {label ?? `${Math.round(percentage)}%`}
        </span>
      )}
    </div>
  );
}
