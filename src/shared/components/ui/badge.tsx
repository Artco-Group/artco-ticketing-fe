import { type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap',
  {
    variants: {
      variant: {
        primary: 'bg-primary-50 text-primary-600 border-primary-500',
        red: 'bg-red-50 text-red-600 border-red-500',
        orange: 'bg-orange-50 text-orange-600 border-orange-500',
        yellow: 'bg-warning-100 text-warning-600 border-warning-500',
        green: 'bg-green-50 text-green-600 border-green-500',
        blue: 'bg-blue-50 text-blue-700 border-blue-500',
        teal: 'bg-teal-100 text-teal-600 border-teal-500',
        pink: 'bg-pink-100 text-pink-600 border-pink-500',
        violet: 'bg-violet-100 text-violet-600 border-violet-500',
        purple: 'bg-purple-100 text-purple-600 border-purple-500',
        grey: 'bg-greyscale-100 text-greyscale-600 border-greyscale-500',
      },
      size: {
        sm: 'px-2 py-0.5 text-[11px]',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'grey',
      size: 'md',
    },
  }
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export type BadgeVariant = NonNullable<BadgeProps['variant']>;

export const Badge = ({
  variant,
  size,
  children,
  icon,
  className,
}: BadgeProps) => {
  return (
    <span className={badgeVariants({ variant, size, className })}>
      {icon && (
        <span className="inline-flex shrink-0 items-center">{icon}</span>
      )}
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
