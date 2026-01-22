// src/shared/components/ui/Checkbox/Checkbox.tsx
import {
  forwardRef,
  useId,
  useEffect,
  useRef,
  type InputHTMLAttributes,
} from 'react';
import { cva } from 'class-variance-authority';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  label?: string;
  indeterminate?: boolean;
}

const checkboxVariants = cva(
  'peer relative shrink-0 appearance-none rounded border border-greyscale-200 bg-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
      checked: {
        true: 'border-primary-500 bg-primary-500',
        false: 'border-greyscale-200 bg-white',
      },
      indeterminate: {
        true: 'border-primary-500 bg-primary-500',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      checked: false,
      indeterminate: false,
    },
  }
);

// Checkmark icon
const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 8l2.5 2.5L12 5" />
  </svg>
);

// Indeterminate icon (horizontal line)
const IndeterminateIcon = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    className={className}
  >
    <line x1="4" y1="8" x2="12" y2="8" />
  </svg>
);

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      checked,
      indeterminate = false,
      disabled,
      className,
      onChange,
      ...props
    },
    ref
  ) => {
    const id = useId();
    const checkboxId = props.id || `checkbox-${id}`;
    const isChecked = checked || false;

    // Handle indeterminate state via ref
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    return (
      <div className={`flex items-center gap-2 ${className || ''}`}>
        <div className="relative inline-flex items-center">
          <input
            ref={(node) => {
              inputRef.current = node;
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            type="checkbox"
            id={checkboxId}
            checked={isChecked && !indeterminate}
            disabled={disabled}
            onChange={onChange}
            className={checkboxVariants({
              size: 'md',
              checked: isChecked || indeterminate,
              indeterminate,
            })}
            aria-checked={
              indeterminate ? 'mixed' : isChecked ? 'true' : 'false'
            }
            {...props}
          />
          {/* Checkmark or indeterminate icon overlay */}
          {(isChecked || indeterminate) && (
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {indeterminate ? (
                <IndeterminateIcon className="h-3 w-3" />
              ) : (
                <CheckIcon className="h-3 w-3" />
              )}
            </span>
          )}
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className={`text-greyscale-700 cursor-pointer text-sm select-none ${
              disabled ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
