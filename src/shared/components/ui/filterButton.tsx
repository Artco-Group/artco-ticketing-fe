import {
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
  type MouseEvent,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Icon } from './Icon';

const filterButtonVariants = cva(
  'inline-flex items-center gap-1.5 rounded-[10px] border px-2.5 py-1 text-[13px] font-medium tracking-[-0.28px] transition-colors duration-150 focus:outline-none',
  {
    variants: {
      active: {
        false:
          'bg-greyscale-100 border-dashed border-greyscale-200 text-greyscale-700 hover:bg-greyscale-100 active:bg-greyscale-200',
        true: 'bg-greyscale-100 border border-greyscale-300 text-greyscale-800 shadow-[0_0_0_1px_rgba(0,0,0,0.04)] hover:bg-greyscale-100 active:bg-greyscale-200',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

export interface FilterButtonProps
  extends
    Omit<
      ButtonHTMLAttributes<HTMLButtonElement>,
      'type' | 'onClick' | 'onChange' | 'value'
    >,
    VariantProps<typeof filterButtonVariants> {
  label: string;
  icon?: ReactNode;
  options?: string[];
  value?: string | null;
  onChange?: (value: string | null) => void;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  onRemove?: () => void;
}

export const FilterButton = ({
  label,
  icon,
  active,
  options,
  value,
  onChange,
  onClick,
  onRemove,
  className,
  ...props
}: FilterButtonProps) => {
  const [internalIndex, setInternalIndex] = useState<number>(-1);

  const hasOptions = options && options.length > 0;

  const getCurrentIndex = (): number => {
    if (!hasOptions || !options) return -1;
    if (value !== undefined) {
      if (value === null) return -1;
      const foundIndex = options.findIndex((opt) => opt === value);
      return foundIndex >= 0 ? foundIndex : -1;
    }
    return internalIndex;
  };

  const currentIndex = getCurrentIndex();
  const currentValue = hasOptions
    ? currentIndex >= 0 && options
      ? options[currentIndex]
      : null
    : value;
  const isActive =
    active !== undefined ? active : hasOptions ? currentIndex >= 0 : !!value;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (hasOptions && options) {
      const nextIndex =
        currentIndex === -1
          ? 0
          : currentIndex >= options.length - 1
            ? -1
            : currentIndex + 1;

      if (value === undefined) {
        setInternalIndex(nextIndex);
      }

      const newValue = nextIndex === -1 ? null : options[nextIndex];
      onChange?.(newValue);
    }

    onClick?.(e);
  };

  return (
    <button
      type="button"
      aria-pressed={!!isActive}
      className={filterButtonVariants({ active: isActive, className })}
      onClick={handleClick}
      {...props}
    >
      {icon && (
        <span className="inline-flex shrink-0 items-center">{icon}</span>
      )}
      <span>{label}</span>
      {currentValue && (
        <>
          <span className="bg-greyscale-200 h-3 w-px" />
          <span>{currentValue}</span>
        </>
      )}
      {onRemove && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              onRemove();
            }
          }}
          className="text-greyscale-400 hover:text-greyscale-600 -mr-0.5 ml-0.5 inline-flex cursor-pointer items-center"
        >
          <Icon name="close" size="xs" />
        </span>
      )}
    </button>
  );
};

FilterButton.displayName = 'FilterButton';
