import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends Omit<
  React.ComponentProps<'input'>,
  'size'
> {
  label?: string;
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
      label,
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
      sm: 'h-8 text-sm px-2.5',
      md: 'h-10 text-sm px-3',
      lg: 'h-12 text-base px-4',
    };

    const iconSizeClasses = {
      sm: 'left-2',
      md: 'left-3',
      lg: 'left-4',
    };

    const iconRightSizeClasses = {
      sm: 'right-2',
      md: 'right-3',
      lg: 'right-4',
    };

    const iconPaddingClasses = {
      sm: 'pl-8',
      md: 'pl-10',
      lg: 'pl-12',
    };

    const iconRightPaddingClasses = {
      sm: 'pr-8',
      md: 'pr-10',
      lg: 'pr-12',
    };

    return (
      <div className="flex w-full flex-col gap-2">
        {label && (
          <label
            className={cn(
              'text-text-tertiary font-[Inter] text-xs leading-4 font-normal',
              error && 'text-destructive'
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div
              className={cn(
                'text-icon-tertiary pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center transition-colors',
                iconSizeClasses[size]
              )}
            >
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              'bg-component-input outline-border-default flex w-full items-center justify-start overflow-hidden rounded-lg shadow-[inset_0px_0px_0px_1px_rgba(238,239,241,1.00)] outline-1 -outline-offset-1',
              'text-text-secondary font-[Inter] leading-5 font-medium',
              'placeholder:text-text-placeholder placeholder:font-[Inter] placeholder:leading-5 placeholder:font-medium',
              'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:-outline-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-colors',
              sizeClasses[size],
              error && 'outline-destructive focus-visible:outline-destructive',
              leftIcon && iconPaddingClasses[size],
              rightIcon && iconRightPaddingClasses[size],
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            {...props}
          />
          {rightIcon && (
            <div
              className={cn(
                'text-icon-tertiary absolute top-1/2 flex -translate-y-1/2 items-center transition-colors',
                iconRightSizeClasses[size]
              )}
            >
              {rightIcon}
            </div>
          )}
        </div>
        {(error || helperText) && (
          <p
            className={cn(
              'font-[Inter] text-xs leading-4 font-normal',
              error ? 'text-destructive font-medium' : 'text-text-tertiary'
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
