import { useMemo } from 'react';
import { type User } from '@artco-group/artco-ticketing-sync';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  Icon,
} from '@/shared/components/ui';
import { MemberBadge } from './MemberBadge';
import { MemberOption } from './MemberOption';

export interface MemberPickerProps {
  /** Currently selected user ID(s) */
  value?: string | string[];
  /** Available users to select from */
  options: User[];
  /** Enable multi-select mode */
  multiple?: boolean;
  /** Change handler */
  onChange: (value: string | string[]) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * MemberPicker - Dropdown to select user(s) with avatar display
 *
 * @example
 * // Single select
 * <MemberPicker
 *   value={selectedUserId}
 *   options={users}
 *   onChange={setSelectedUserId}
 * />
 *
 * @example
 * // Multi select
 * <MemberPicker
 *   value={selectedUserIds}
 *   options={users}
 *   multiple
 *   onChange={setSelectedUserIds}
 * />
 */
export function MemberPicker({
  value,
  options,
  multiple = false,
  onChange,
  placeholder = 'Select member...',
  disabled = false,
  className,
}: MemberPickerProps) {
  const validUsers = useMemo(
    () => options.filter((user) => user._id),
    [options]
  );

  const selectedIds = useMemo(() => {
    if (multiple) {
      return Array.isArray(value) ? value : value ? [value] : [];
    }
    const v = Array.isArray(value) ? value[0] : value;
    return v ? [v] : [];
  }, [value, multiple]);

  const selectedUsers = useMemo(
    () => validUsers.filter((user) => selectedIds.includes(user._id!)),
    [validUsers, selectedIds]
  );

  const handleOptionSelect = (userId: string) => {
    if (multiple) {
      const newValue = selectedIds.includes(userId)
        ? selectedIds.filter((id) => id !== userId)
        : [...selectedIds, userId];
      onChange(newValue);
    } else {
      onChange(selectedIds[0] === userId ? '' : userId);
    }
  };

  const handleRemoveBadge = (userId: string) => {
    if (multiple) {
      onChange(selectedIds.filter((id) => id !== userId));
    } else {
      onChange('');
    }
  };

  const triggerContent =
    selectedUsers.length > 0 ? (
      <div className="flex flex-wrap gap-1">
        {selectedUsers.map((user) => (
          <MemberBadge
            key={user._id!}
            user={user}
            disabled={disabled}
            onRemove={() => handleRemoveBadge(user._id!)}
          />
        ))}
      </div>
    ) : (
      <span className="text-muted-foreground flex-1 text-left">
        {placeholder}
      </span>
    );

  const triggerClassName = cn(
    'border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
    multiple ? 'min-h-[2.25rem] h-auto' : 'h-9',
    selectedUsers.length > 0 && multiple && 'py-1'
  );

  return (
    <div className={cn(className)}>
      <DropdownMenu>
        <DropdownMenuTrigger className={triggerClassName} disabled={disabled}>
          <div className="flex min-w-0 flex-1 items-center gap-1">
            {triggerContent}
          </div>
          <div className="ml-2 flex shrink-0 items-center gap-1">
            <span className="text-muted-foreground text-sm font-medium">
              Member
            </span>
            <Icon name="chevron-down" size="md" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
          {validUsers.length === 0 ? (
            <div className="text-muted-foreground px-2 py-4 text-center text-sm">
              No members available
            </div>
          ) : (
            validUsers.map((user) => (
              <MemberOption
                key={user._id!}
                user={user}
                isSelected={selectedIds.includes(user._id!)}
                onSelect={() => handleOptionSelect(user._id!)}
              />
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
