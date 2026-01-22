// src/shared/components/ui/Select/Select.tsx
import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
} from 'react';
import { cva } from 'class-variance-authority';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  options: (string | SelectOption)[];
  value?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (value: string) => void;
  className?: string;
}

// Reuse Input styling variants
const selectTriggerVariants = cva(
  'w-full rounded-[8px] border bg-white transition-all placeholder:text-greyscale-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-greyscale-50 disabled:text-greyscale-400 shadow-[inset_0px_0px_0px_1px_rgba(238,239,241,1)] cursor-pointer flex items-center justify-between',
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
      isOpen: {
        true: 'border-primary-500 ring-2 ring-primary-500/10',
        false: '',
      },
    },
    defaultVariants: {
      size: 'md',
      error: false,
      isOpen: false,
    },
  }
);

// Chevron down icon
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path d="M4 6l4 4 4-4" />
  </svg>
);

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      label,
      options,
      value,
      placeholder = 'Select an option',
      error,
      helperText,
      disabled = false,
      size = 'md',
      onChange,
      className,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const selectRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    // Normalize options to always be objects
    const normalizedOptions: SelectOption[] = options.map((option) =>
      typeof option === 'string' ? { value: option, label: option } : option
    );

    // Find selected option
    const selectedOption = normalizedOptions.find((opt) => opt.value === value);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setFocusedIndex(-1);
        }
      };

      if (isOpen) {
        // Use mousedown instead of click to catch events before they bubble
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }
    }, [isOpen]);

    const handleSelect = (selectedValue: string) => {
      onChange?.(selectedValue);
      setIsOpen(false);
      setFocusedIndex(-1);
      buttonRef.current?.focus();
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      if (!isOpen) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault();
          setIsOpen(true);
          setFocusedIndex(0);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev < normalizedOptions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0 && focusedIndex < normalizedOptions.length) {
            handleSelect(normalizedOptions[focusedIndex].value);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setFocusedIndex(-1);
          buttonRef.current?.focus();
          break;
        case 'Tab':
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
      }
    };

    // Scroll focused option into view
    useEffect(() => {
      if (isOpen && focusedIndex >= 0 && listRef.current) {
        const focusedElement = listRef.current.children[
          focusedIndex
        ] as HTMLElement;
        if (focusedElement) {
          focusedElement.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
          });
        }
      }
    }, [isOpen, focusedIndex]);

    const handleToggle = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
        if (!isOpen) {
          // Set focus to currently selected option or first option
          const currentIndex = normalizedOptions.findIndex(
            (opt) => opt.value === value
          );
          setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
        }
      }
    };

    const hasError = !!error;

    return (
      <div ref={selectRef} className={`w-full ${className || ''}`}>
        {label && (
          <label className="text-greyscale-500 mb-2 block text-[13px] leading-[18px] font-normal tracking-[-0.28px]">
            {label}
          </label>
        )}
        <div className="relative">
          <button
            ref={(node) => {
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
              buttonRef.current = node;
            }}
            type="button"
            disabled={disabled}
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-label={label || 'Select option'}
            className={selectTriggerVariants({
              size,
              error: hasError,
              isOpen,
            })}
          >
            <span
              className={`flex-1 text-left ${
                selectedOption ? 'text-greyscale-900' : 'text-greyscale-400'
              }`}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDownIcon
              className={`text-greyscale-400 ml-2 h-4 w-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown menu */}
          {isOpen && (
            <ul
              ref={listRef}
              role="listbox"
              tabIndex={-1}
              onKeyDown={(e) => {
                switch (e.key) {
                  case 'ArrowDown':
                    e.preventDefault();
                    setFocusedIndex((prev) =>
                      prev < normalizedOptions.length - 1 ? prev + 1 : prev
                    );
                    break;
                  case 'ArrowUp':
                    e.preventDefault();
                    setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
                    break;
                  case 'Enter':
                    e.preventDefault();
                    if (
                      focusedIndex >= 0 &&
                      focusedIndex < normalizedOptions.length
                    ) {
                      handleSelect(normalizedOptions[focusedIndex].value);
                    }
                    break;
                  case 'Escape':
                    e.preventDefault();
                    setIsOpen(false);
                    setFocusedIndex(-1);
                    buttonRef.current?.focus();
                    break;
                }
              }}
              className="border-greyscale-200 absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-[8px] border bg-white shadow-lg focus:outline-none"
            >
              {normalizedOptions.map((option, index) => {
                const isSelected = option.value === value;
                const isFocused = index === focusedIndex;

                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(e) => {
                      // Prevent the click outside handler from firing
                      e.preventDefault();
                      e.stopPropagation();
                      handleSelect(option.value);
                    }}
                    className={`cursor-pointer px-3 py-2 text-sm transition-colors ${
                      isSelected
                        ? 'bg-primary-50 text-primary-600'
                        : isFocused
                          ? 'bg-greyscale-100 text-greyscale-900'
                          : 'text-greyscale-700 hover:bg-greyscale-50'
                    } ${
                      size === 'sm'
                        ? 'text-xs'
                        : size === 'lg'
                          ? 'text-base'
                          : ''
                    }`}
                  >
                    {option.label}
                  </li>
                );
              })}
            </ul>
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

Select.displayName = 'Select';
