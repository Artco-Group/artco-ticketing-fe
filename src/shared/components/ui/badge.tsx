import * as React from 'react';
import { type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs',
  {
    variants: {
      variant: {
        default:
          'rounded-md border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary:
          'font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2rounded-md border border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'rounded-md border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline:
          'rounded-md border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground',
        basic: 'font-medium whitespace-nowrap',
      },
      size: {
        sm: 'px-2 py-0.5 text-[11px]',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'basic',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export const Badge = ({
  size,
  children,
  icon,
  className,
  variant,
  ...props
}: BadgeProps) => {
  return (
    <div className={cn(badgeVariants({ variant }), className, size)} {...props}>
      {icon && (
        <span className="inline-flex shrink-0 items-center">{icon}</span>
      )}
      {children}
    </div>
  );
};

Badge.displayName = 'Badge';
