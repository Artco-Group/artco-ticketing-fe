import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { parseISO } from 'date-fns';
import { formatDateDisplay } from '@artco-group/artco-ticketing-sync';
import { cn } from '@/lib/utils';
import { Icon } from './Icon';
import { Calendar } from './Calendar';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';

export interface InlineDateEditProps {
  label: string;
  value: string | Date | null | undefined;
  canEdit?: boolean;
  isLoading?: boolean;
  onChange: (date: string | null) => void;
  placeholder?: string;
  renderValue?: (value: string | Date | null | undefined) => ReactNode;
  locale?: string;
  labelClassName?: string;
}

function parseValue(value: string | Date | null | undefined): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  try {
    return parseISO(value);
  } catch {
    return undefined;
  }
}

export function InlineDateEdit({
  label,
  value,
  canEdit = true,
  isLoading = false,
  onChange,
  renderValue,
  locale,
  labelClassName,
}: InlineDateEditProps) {
  const dateLanguage = locale || 'en';
  const [displayValue, setDisplayValue] = useState<
    string | Date | null | undefined
  >(value);
  const [open, setOpen] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Debounced save - waits 500ms after last change before saving
  const debouncedSave = useCallback(
    (dateValue: string | null) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        onChange(dateValue);
      }, 500);
    },
    [onChange]
  );

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      const isoDate = date.toISOString();
      setDisplayValue(isoDate);
      debouncedSave(isoDate);
    } else {
      setDisplayValue(null);
      debouncedSave(null);
    }
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDisplayValue(null);
    onChange(null);
  };

  const selectedDate = parseValue(displayValue);

  const displayContent = renderValue ? (
    renderValue(displayValue)
  ) : (
    <span className="text-sm whitespace-nowrap">
      {formatDateDisplay(displayValue, dateLanguage, 'long')}
    </span>
  );

  const labelCls = cn(
    'text-muted-foreground mr-3 w-28 shrink-0 text-sm whitespace-nowrap',
    labelClassName
  );

  if (!canEdit) {
    return (
      <div className="flex h-8 items-center justify-start">
        <span className={labelCls}>{label}</span>
        <span className="select-none">{displayContent}</span>
      </div>
    );
  }

  return (
    <div className="flex h-8 items-center justify-start">
      <span className={labelCls}>{label}</span>
      <div className="group relative flex items-center">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={isLoading}
              className={cn(
                '-mx-1.5 -my-0.5 flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-0.5 text-left transition-all',
                'hover:bg-muted/60',
                isLoading && 'cursor-not-allowed opacity-50'
              )}
            >
              {displayContent}
              <Icon
                name="chevron-selector"
                size="xs"
                className="text-muted-foreground shrink-0 opacity-0 transition-opacity group-hover:opacity-60"
              />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              locale={dateLanguage}
              autoFocus
            />
          </PopoverContent>
        </Popover>
        {displayValue && (
          <button
            type="button"
            onClick={handleClear}
            disabled={isLoading}
            className="text-muted-foreground hover:text-destructive ml-1 rounded p-0.5 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-50 disabled:cursor-not-allowed"
            title="Clear date"
          >
            <Icon name="close" size="xs" />
          </button>
        )}
      </div>
    </div>
  );
}
