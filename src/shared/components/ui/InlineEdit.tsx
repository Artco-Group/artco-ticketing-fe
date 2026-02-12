import { useOptimistic, startTransition, type ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './dropdown-menu';

export interface InlineEditOption<T = string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

export interface InlineEditProps<T = string> {
  label: string;
  value: T;
  options: InlineEditOption<T>[];
  renderValue: (value: T) => ReactNode;
  renderOption?: (option: InlineEditOption<T>) => ReactNode;
  canEdit?: boolean;
  isLoading?: boolean;
  onChange: (value: T) => void;
}

export function InlineEdit<T = string>({
  label,
  value,
  options,
  renderValue,
  renderOption,
  canEdit = true,
  isLoading = false,
  onChange,
}: InlineEditProps<T>) {
  const [optimisticValue, setOptimisticValue] = useOptimistic(
    value,
    (_current, newValue: T) => newValue
  );

  const displayContent = renderValue(optimisticValue);

  const defaultRenderOption = (option: InlineEditOption<T>) => (
    <>
      {option.icon}
      <span>{option.label}</span>
    </>
  );

  const handleChange = (newValue: T) => {
    startTransition(() => {
      setOptimisticValue(newValue);
    });
    onChange(newValue);
  };

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
    <div className="flex h-8 items-center justify-start">
      <span className="text-muted-foreground mr-3 w-20 shrink-0 text-sm">
        {label}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isLoading}>
          <button className="m-0 flex cursor-pointer items-center justify-start p-0 text-left transition-opacity hover:opacity-80">
            {displayContent}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="bottom" sideOffset={4}>
          {options.map((option, index) => (
            <DropdownMenuItem
              key={String(option.value) || index}
              onClick={() => handleChange(option.value)}
              className="flex cursor-pointer items-center gap-2"
            >
              {renderOption
                ? renderOption(option)
                : defaultRenderOption(option)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
