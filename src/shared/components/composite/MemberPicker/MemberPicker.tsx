import { useMemo } from 'react';
import { type User } from '@artco-group/artco-ticketing-sync';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  Icon,
} from '@/shared/components/ui';
import { MemberBadge } from './MemberBadge';
import { MemberOption } from './MemberOption';

export interface MemberGroup {
  key: string;
  label: string;
}

export interface MemberPickerProps {
  value?: string | string[];
  options: User[];
  multiple?: boolean;
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  groupBy?: keyof User;
  groups?: MemberGroup[];
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
  label = 'Member',
  groupBy,
  groups,
}: MemberPickerProps) {
  const validUsers = useMemo(
    () => options.filter((user) => user.id),
    [options]
  );

  const groupedUsers = useMemo(() => {
    if (!groupBy || !groups) return null;

    const grouped = new Map<string, User[]>();
    groups.forEach((g) => grouped.set(g.key, []));

    validUsers.forEach((user) => {
      const key = user[groupBy] as string;
      if (grouped.has(key)) {
        grouped.get(key)!.push(user);
      }
    });

    return groups
      .map((g) => ({
        ...g,
        users: grouped.get(g.key) || [],
      }))
      .filter((g) => g.users.length > 0);
  }, [validUsers, groupBy, groups]);

  const selectedIds = useMemo(() => {
    if (multiple) {
      return Array.isArray(value) ? value : value ? [value] : [];
    }
    const v = Array.isArray(value) ? value[0] : value;
    return v ? [v] : [];
  }, [value, multiple]);

  const selectedUsers = useMemo(
    () => validUsers.filter((user) => selectedIds.includes(user.id!)),
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
            key={user.id!}
            user={user}
            disabled={disabled}
            onRemove={() => handleRemoveBadge(user.id!)}
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
              {label}
            </span>
            <Icon name="chevron-down" size="md" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[var(--radix-dropdown-menu-trigger-width)]"
          side="bottom"
          align="start"
        >
          {validUsers.length === 0 ? (
            <div className="text-muted-foreground px-2 py-4 text-center text-sm">
              No users available
            </div>
          ) : groupedUsers ? (
            groupedUsers.map((group, index) => (
              <div key={group.key}>
                {index > 0 && <DropdownMenuSeparator />}
                <DropdownMenuLabel className="text-muted-foreground text-xs">
                  {group.label}
                </DropdownMenuLabel>
                {group.users.map((user) => (
                  <MemberOption
                    key={user.id!}
                    user={user}
                    isSelected={selectedIds.includes(user.id!)}
                    onSelect={() => handleOptionSelect(user.id!)}
                  />
                ))}
              </div>
            ))
          ) : (
            validUsers.map((user) => (
              <MemberOption
                key={user.id!}
                user={user}
                isSelected={selectedIds.includes(user.id!)}
                onSelect={() => handleOptionSelect(user.id!)}
              />
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
