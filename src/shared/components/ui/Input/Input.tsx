// src/shared/components/ui/Input/Input.tsx
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cva } from 'class-variance-authority';
// import { cn } from '@/shared/utils/cn';

const inputVariants = cva(
  'w-full rounded-[8px] border bg-white transition-all placeholder:text-greyscale-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-greyscale-50 disabled:text-greyscale-400 shadow-[inset_0px_0px_0px_1px_rgba(238,239,241,1)]',
  {
    variants: {
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-11 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
      },
      error: {
        true: 'border-error-500 focus:border-error-500 focus:ring-2 focus:ring-error-500/10',
        false:
          'border-greyscale-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10',
      },
      hasLeftIcon: {
        true: '',
        false: '',
      },
      hasRightIcon: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        hasLeftIcon: true,
        size: 'sm',
        class: 'pl-9',
      },
      {
        hasLeftIcon: true,
        size: 'md',
        class: 'pl-10',
      },
      {
        hasLeftIcon: true,
        size: 'lg',
        class: 'pl-11',
      },
      {
        hasRightIcon: true,
        size: 'sm',
        class: 'pr-9',
      },
      {
        hasRightIcon: true,
        size: 'md',
        class: 'pr-10',
      },
      {
        hasRightIcon: true,
        size: 'lg',
        class: 'pr-11',
      },
    ],
    defaultVariants: {
      size: 'md',
      error: false,
      hasLeftIcon: false,
      hasRightIcon: false,
    },
  }
);

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      size = 'md',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasError = !!error;
    const iconSize =
      size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-5 h-5';
    const iconLeftPosition =
      size === 'sm' ? 'left-3' : size === 'md' ? 'left-3' : 'left-4';
    const iconRightPosition =
      size === 'sm' ? 'right-3' : size === 'md' ? 'right-3' : 'right-4';

    return (
      <div className="w-full">
        {label && (
          <label className="text-greyscale-500 mb-2 block text-[13px] leading-[18px] font-normal tracking-[-0.28px]">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span
              className={`absolute ${iconLeftPosition} text-greyscale-400 pointer-events-none top-1/2 -translate-y-1/2 ${iconSize}`}
            >
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={inputVariants({
              size,
              error: hasError,
              hasLeftIcon: !!leftIcon,
              hasRightIcon: !!rightIcon,
              className,
            })}
            {...props}
          />
          {rightIcon && (
            <span
              className={`absolute ${iconRightPosition} text-greyscale-400 top-1/2 -translate-y-1/2 ${iconSize}`}
            >
              {rightIcon}
            </span>
          )}
        </div>
        {(error || helperText) && (
          <p
            className={`mt-1 text-[13px] leading-[18px] tracking-[-0.28px] ${
              error ? 'text-error-500' : 'text-greyscale-500'
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
