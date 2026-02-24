/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Spinner } from '@/shared/components/ui/Spinner';
import { Icon, type IconName } from '@/shared/components/ui/Icon/Icon';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/90 focus:ring-primary/20 border border-transparent active:border-[#5a5a5a] transition-[border-color,opacity] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_50%_49%_at_50%_0%,_rgba(245,245,245,0.40)_0%,_rgba(255,255,255,0)_100%)] before:transition-opacity before:duration-150 active:before:opacity-0 after:absolute after:inset-0 after:pointer-events-none after:rounded-[inherit] after:shadow-[inset_0px_0px_0px_1px_white] after:opacity-0 after:transition-opacity after:duration-150 active:after:opacity-100',
        destructive:
          'bg-destructive text-primary-foreground shadow-sm hover:bg-destructive/90 focus:ring-destructive/20 border border-transparent active:border-[#5a5a5a] transition-[border-color,opacity] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_50%_49%_at_50%_0%,_rgba(245,245,245,0.40)_0%,_rgba(255,255,255,0)_100%)] before:transition-opacity before:duration-150 active:before:opacity-0 after:absolute after:inset-0 after:pointer-events-none after:rounded-[inherit] after:shadow-[inset_0px_0px_0px_1px_white] after:opacity-0 after:transition-opacity after:duration-150 active:after:opacity-100',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground focus:ring-input/20',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 focus:ring-secondary/20 border border-transparent active:border-[#5a5a5a] transition-[border-color,opacity] before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_50%_49%_at_50%_0%,_rgba(245,245,245,0.40)_0%,_rgba(255,255,255,0)_100%)] before:transition-opacity before:duration-150 active:before:opacity-0 after:absolute after:inset-0 after:pointer-events-none after:rounded-[inherit] after:shadow-[inset_0px_0px_0px_1px_white] after:opacity-0 after:transition-opacity after:duration-150 active:after:opacity-100',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        md: 'h-9 rounded-md px-4 py-2',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: IconName;
  rightIcon?: IconName;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || loading;
    const leftIconElement = leftIcon ? <Icon name={leftIcon} /> : null;
    const rightIconElement = rightIcon ? <Icon name={rightIcon} /> : null;
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        <span className="relative z-10 inline-flex items-center gap-2">
          {loading && <Spinner size="sm" className="text-current" />}
          {!loading && leftIconElement}
          {children}
          {rightIconElement}
        </span>
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
