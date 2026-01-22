// src/shared/components/ui/PasswordInput/PasswordInput.tsx
import { forwardRef, useState, type ChangeEvent } from 'react';
import { Input, type InputProps } from '../Input';

export interface PasswordInputProps extends Omit<
  InputProps,
  'type' | 'rightIcon'
> {
  showStrengthMeter?: boolean;
}

// Eye icon component (show password)
const EyeIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// Eye off icon component (hide password)
const EyeOffIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// Password strength meter component
interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const calculateStrength = (
    pwd: string
  ): {
    score: number;
    label: string;
    color: string;
  } => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z\d]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-error-500' };
    if (score <= 3) return { score: 2, label: 'Fair', color: 'bg-warning-500' };
    if (score <= 4) return { score: 3, label: 'Good', color: 'bg-info-500' };
    return { score: 4, label: 'Strong', color: 'bg-success-500' };
  };

  const { score, label, color } = calculateStrength(password);

  return (
    <div className="mt-2">
      <div className="bg-greyscale-100 flex h-1 w-full gap-1 overflow-hidden rounded-full">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-full flex-1 transition-all duration-300 ${
              level <= score && password ? color : 'bg-greyscale-100'
            }`}
          />
        ))}
      </div>
      {password && (
        <p className="text-greyscale-500 mt-1 text-[12px]">Strength: {label}</p>
      )}
    </div>
  );
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showStrengthMeter, value, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState('');

    // Track password value for strength meter (works with both controlled and uncontrolled inputs)
    const passwordValue = value !== undefined ? String(value) : internalValue;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      // Update internal state for uncontrolled inputs
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      // Call user's onChange if provided
      onChange?.(e);
    };

    return (
      <div>
        <Input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={handleChange}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-greyscale-400 hover:text-greyscale-600 flex cursor-pointer items-center justify-center bg-none p-0 transition-colors duration-200 ease-in-out focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOffIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          }
          {...props}
        />
        {showStrengthMeter && (
          <PasswordStrengthMeter password={passwordValue} />
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
