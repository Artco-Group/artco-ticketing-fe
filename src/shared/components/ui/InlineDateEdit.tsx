import {
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type ChangeEvent,
} from 'react';
import { cn } from '@/lib/utils';

export interface InlineDateEditProps {
  label: string;
  value: string | Date | null | undefined;
  canEdit?: boolean;
  isLoading?: boolean;
  onChange: (date: string | null) => void;
  placeholder?: string;
  renderValue?: (value: string | Date | null | undefined) => ReactNode;
}

function formatDateDisplay(value: string | Date | null | undefined): string {
  if (!value) return '-';
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateInput(value: string | Date | null | undefined): string {
  if (!value) return '';
  const date = typeof value === 'string' ? new Date(value) : value;
  return date.toISOString().split('T')[0];
}

export function InlineDateEdit({
  label,
  value,
  canEdit = true,
  isLoading = false,
  onChange,
  renderValue,
}: InlineDateEditProps) {
  const [displayValue, setDisplayValue] = useState<
    string | Date | null | undefined
  >(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const handleClick = () => {
    if (!canEdit || isLoading) return;
    inputRef.current?.showPicker();
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue) {
      const newDate = new Date(newValue).toISOString();
      setDisplayValue(newDate);
      onChange(newDate);
    } else {
      setDisplayValue(null);
      onChange(null);
    }
  };

  const displayContent = renderValue ? (
    renderValue(displayValue)
  ) : (
    <span className="text-sm">{formatDateDisplay(displayValue)}</span>
  );

  if (!canEdit) {
    return (
      <div className="flex h-8 items-center justify-start">
        <span className="text-muted-foreground mr-3 w-20 shrink-0 text-sm">
          {label}
        </span>
        {displayContent}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex h-8 items-center justify-start">
        <button
          type="button"
          onClick={handleClick}
          disabled={isLoading}
          className="m-0 flex cursor-pointer items-center justify-start p-0 text-left transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-muted-foreground mr-3 w-20 shrink-0 text-sm">
            {label}
          </span>
          {displayContent}
        </button>
      </div>
      {/* Hidden date input - only used to trigger the native picker */}
      <input
        ref={inputRef}
        type="date"
        value={formatDateInput(displayValue)}
        onChange={handleDateChange}
        className={cn(
          'absolute inset-0 h-full w-full cursor-pointer opacity-0',
          '[&::-webkit-calendar-picker-indicator]:absolute',
          '[&::-webkit-calendar-picker-indicator]:inset-0',
          '[&::-webkit-calendar-picker-indicator]:h-full',
          '[&::-webkit-calendar-picker-indicator]:w-full',
          '[&::-webkit-calendar-picker-indicator]:cursor-pointer',
          '[&::-webkit-calendar-picker-indicator]:opacity-0'
        )}
        tabIndex={-1}
      />
    </div>
  );
}
