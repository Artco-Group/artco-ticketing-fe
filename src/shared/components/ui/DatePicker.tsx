import * as React from 'react';
import { format, parseISO } from 'date-fns';
import { enUS, bs } from 'date-fns/locale';
import type { Locale } from 'date-fns';
import { cn } from '@/lib/utils';
import { Icon } from './Icon';
import { Button } from './Button';
import { Calendar } from './Calendar';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';

const localeMap: Record<string, Locale> = {
  en: enUS,
  bs: bs,
};

export interface DatePickerProps {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  value?: string | null;
  onChange?: (value: string | null) => void;
  clearable?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  locale?: string;
}

function parseValue(value: string | null | undefined): Date | undefined {
  if (!value) return undefined;
  try {
    return parseISO(value);
  } catch {
    return undefined;
  }
}

function toISOFormat(date: Date): string {
  return date.toISOString();
}

const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
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
      clearable = false,
      disabled,
      placeholder = 'Pick a date',
      locale = 'en',
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const selectedDate = parseValue(value);
    const dateFnsLocale = localeMap[locale] || enUS;

    const sizeClasses = {
      sm: 'h-8 text-sm px-3',
      md: 'h-10 text-sm px-3',
      lg: 'h-12 text-base px-4',
    };

    const handleSelect = (date: Date | undefined) => {
      if (onChange) {
        onChange(date ? toISOFormat(date) : null);
      }
      setOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (onChange && !disabled) {
        onChange(null);
      }
    };

    const showClearButton = clearable && value && !disabled;

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
        <Popover open={open} onOpenChange={setOpen}>
          <div className="group relative">
            <PopoverTrigger asChild>
              <Button
                ref={ref}
                variant="outline"
                disabled={disabled}
                aria-invalid={!!error}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !selectedDate && 'text-muted-foreground',
                  sizeClasses[size],
                  showClearButton && 'pr-9',
                  error &&
                    'border-destructive focus-visible:ring-destructive/20',
                  className
                )}
              >
                <Icon name="clock" size="sm" className="mr-2" />
                {selectedDate ? (
                  format(selectedDate, 'PPP', { locale: dateFnsLocale })
                ) : (
                  <span>{placeholder}</span>
                )}
              </Button>
            </PopoverTrigger>
            {showClearButton && (
              <button
                type="button"
                onClick={handleClear}
                className="text-muted-foreground hover:text-destructive absolute top-1/2 right-3 flex -translate-y-1/2 items-center rounded p-0.5 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50"
                title="Clear date"
              >
                <Icon name="close" size="xs" />
              </button>
            )}
          </div>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              locale={locale}
              autoFocus
            />
          </PopoverContent>
        </Popover>
        {(error || helperText) && (
          <p
            className={cn(
              'text-xs leading-4',
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
DatePicker.displayName = 'DatePicker';

export { DatePicker };
