import { type ReactNode } from 'react';

export type IconVariant =
  | 'primary'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'teal'
  | 'pink'
  | 'violet'
  | 'purple'
  | 'grey';

const variantColors: Record<IconVariant, string> = {
  primary: 'var(--icon-core)',
  red: 'var(--icon-danger-default)',
  orange: 'var(--badge-orange)',
  yellow: 'var(--badge-yellow)',
  green: 'var(--icon-success)',
  blue: 'var(--icon-core)',
  teal: 'var(--icon-info)',
  pink: 'var(--icon-support)',
  violet: 'var(--icon-highlight)',
  purple: 'var(--icon-component)',
  grey: 'var(--color-greyscale-500)',
};

export const StatusIcon = ({
  fillPercent,
  variant = 'grey',
  dotted = false,
  className,
}: {
  fillPercent: number;
  variant?: IconVariant;
  dotted?: boolean;
  className?: string;
}): ReactNode => {
  const color = variantColors[variant];
  const radius = 8;
  const centerX = 8;
  const centerY = 8;
  const startX = centerX;
  const startY = centerY - radius;

  let pathData = '';
  let useCircle = false;

  if (fillPercent === 0) {
    pathData = '';
  } else if (fillPercent === 100) {
    useCircle = true;
  } else {
    const angle = (fillPercent / 100) * 360 - 90;
    const radians = (angle * Math.PI) / 180;
    const endX = centerX + radius * Math.cos(radians);
    const endY = centerY + radius * Math.sin(radians);
    const largeArcFlag = fillPercent > 50 ? 1 : 0;
    pathData = `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
  }

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <rect
        x="0"
        y="0"
        width="16"
        height="16"
        rx="8"
        fill={'var(--color-greyscale-0)'}
      />
      {useCircle ? (
        <circle cx={centerX} cy={centerY} r={radius} fill={color} />
      ) : (
        pathData && <path d={pathData} fill={color} />
      )}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius - 0.6}
        stroke={color}
        strokeWidth="1.2"
        strokeDasharray={dotted ? '2.5 2' : undefined}
        fill="none"
      />
    </svg>
  );
};

export const PriorityIcon = ({
  filledBars,
  variant = 'grey',
  className,
}: {
  filledBars: number;
  variant?: IconVariant;
  className?: string;
}): ReactNode => {
  const color = variantColors[variant];
  const barWidth = 2;
  const barGap = 1.5;
  const barHeights = [3, 5, 7, 9];
  const totalWidth = barWidth * 4 + barGap * 3;
  const startX = (16 - totalWidth) / 2;
  const textBaseline = 13;

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      {[0, 1, 2, 3].map((index) => {
        const x = startX + index * (barWidth + barGap);
        const height = barHeights[index];
        const y = textBaseline - height;
        const isFilled = index < filledBars;

        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={barWidth}
            height={height}
            rx={1}
            fill={isFilled ? color : 'var(--color-greyscale-200)'}
            stroke={isFilled ? color : 'var(--color-greyscale-200)'}
            strokeWidth="0.5"
          />
        );
      })}
    </svg>
  );
};
