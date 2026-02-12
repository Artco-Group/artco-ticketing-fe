import * as React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from './Icon';

export interface DatePickerProps extends Omit<
  React.ComponentProps<'input'>,
  'type' | 'size' | 'value' | 'onChange'
> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

function toInputFormat(value: string | undefined): string {
  if (!value) return '';
  if (value.includes('T')) {
    return value.split('T')[0];
  }
  return value;
}

/**
 * Converts YYYY-MM-DD to ISO string
 */
function toISOFormat(value: string): string {
  if (!value) return '';
  return new Date(value).toISOString();
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      size = 'md',
      required,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const sizeClasses = {
      sm: 'h-8 text-sm px-2.5 pl-8',
      md: 'h-10 text-sm px-3 pl-10',
      lg: 'h-12 text-base px-4 pl-12',
    };

    const iconSizeClasses = {
      sm: 'left-2',
      md: 'left-3',
      lg: 'left-4',
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      if (onChange) {
        onChange(inputValue ? toISOFormat(inputValue) : '');
      }
    };

    const handleIconClick = () => {
      inputRef.current?.showPicker();
    };

    return (
      <div className="flex w-full flex-col gap-2.5">
        {label && (
          <label
            className={cn(
              'text-muted-foreground text-sm leading-none font-medium',
              error && 'text-destructive'
            )}
          >
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <button
            type="button"
            onClick={handleIconClick}
            className={cn(
              'text-icon-tertiary hover:text-text-secondary absolute top-1/2 flex -translate-y-1/2 items-center transition-colors',
              iconSizeClasses[size]
            )}
          >
            <Icon name="clock" size={size === 'lg' ? 'md' : 'sm'} />
          </button>
          <input
            type="date"
            className={cn(
              'bg-component-input outline-border-default flex w-full cursor-pointer items-center justify-start overflow-hidden rounded-lg shadow-[inset_0px_0px_0px_1px_rgba(238,239,241,1.00)] outline-1 -outline-offset-1',
              'text-text-secondary font-[Inter] leading-5 font-medium',
              'placeholder:text-text-placeholder placeholder:font-[Inter] placeholder:leading-5 placeholder:font-medium',
              'focus-visible:outline-border-focus focus-visible:outline-2 focus-visible:-outline-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-colors',
              // Hide native calendar picker indicator
              '[&::-webkit-calendar-picker-indicator]:hidden',
              '[&::-webkit-calendar-picker-indicator]:appearance-none',
              sizeClasses[size],
              error && 'outline-destructive focus-visible:outline-destructive',
              className
            )}
            ref={inputRef}
            value={toInputFormat(value)}
            onChange={handleChange}
            aria-invalid={!!error}
            {...props}
          />
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
DatePicker.displayName = 'DatePicker';

export { DatePicker };
