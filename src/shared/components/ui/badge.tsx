import { type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium whitespace-nowrap',
  {
    variants: {
      size: {
        sm: 'px-2 py-0.5 text-[11px]',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export const Badge = ({ size, children, icon, className }: BadgeProps) => {
  return (
    <span className={badgeVariants({ size, className })}>
      {icon && (
        <span className="inline-flex shrink-0 items-center">{icon}</span>
      )}
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
