import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<
  React.ComponentProps<'input'>,
  'size'
> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      leftIcon,
      rightIcon,
      error,
      helperText,
      size = 'md',
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'h-8 text-xs',
      md: 'h-9 text-sm',
      lg: 'h-10 text-base',
    };

    return (
      <div className="w-full">
        <div className="relative">
          {leftIcon && (
            <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 flex -translate-y-1/2 items-center transition-colors">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'border-input placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-destructive focus-visible:ring-destructive',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              sizeClasses[size],
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            {...props}
          />
          {rightIcon && (
            <div className="text-muted-foreground absolute top-1/2 right-3 flex -translate-y-1/2 items-center transition-colors">
              {rightIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p
            className={cn(
              'mt-1.5 text-[0.8rem]',
              error ? 'text-destructive font-medium' : 'text-muted-foreground'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
