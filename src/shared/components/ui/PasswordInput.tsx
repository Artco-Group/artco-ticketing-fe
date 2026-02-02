// src/shared/components/ui/PasswordInput/PasswordInput.tsx
import { forwardRef, useState } from 'react';
import { Input, type InputProps } from './Input';
import { Icon } from './Icon';
import { PasswordStrengthMeter } from './PasswordStregthMeter';

interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightIcon'> {
  showStrengthMeter?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showStrengthMeter, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div>
        <Input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-muted-foreground hover:text-foreground pointer-events-auto absolute top-1/2 right-0 flex -translate-y-1/2 items-center transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <Icon name="eye-off" size="md" />
              ) : (
                <Icon name="eye" size="md" />
              )}
            </button>
          }
          {...props}
        />
        {showStrengthMeter && props.value && (
          <PasswordStrengthMeter password={String(props.value)} />
        )}
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';
