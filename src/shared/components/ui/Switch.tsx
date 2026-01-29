// src/shared/components/ui/Switch/Switch.tsx
import { forwardRef, useId, type ButtonHTMLAttributes } from 'react';

export interface SwitchProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'onChange'
> {
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    { label, checked = false, disabled = false, onChange, className, ...props },
    ref
  ) => {
    const id = useId();
    const switchId = props.id || `switch-${id}`;

    return (
      <div className={`flex items-center gap-2 ${className || ''}`}>
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-labelledby={label ? `${switchId}-label` : undefined}
          disabled={disabled}
          onClick={() => {
            if (!disabled && onChange) {
              onChange(!checked);
            }
          }}
          className={`focus:ring-primary/20 relative inline-flex h-4 w-6 shrink-0 cursor-pointer rounded-full border-0 p-0.5 transition-colors duration-200 ease-in-out focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
            checked ? 'bg-primary' : 'bg-greyscale-200'
          }`}
          {...props}
        >
          {/* Sliding handle */}
          <span
            className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
              checked ? 'translate-x-2' : 'translate-x-0'
            }`}
            aria-hidden="true"
          />
        </button>
        {label && (
          <label
            id={`${switchId}-label`}
            htmlFor={switchId}
            className={`text-greyscale-700 cursor-pointer text-sm select-none ${
              disabled ? 'cursor-not-allowed opacity-50' : ''
            }`}
            onClick={(e) => {
              if (!disabled) {
                e.preventDefault();
                onChange?.(!checked);
              }
            }}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
