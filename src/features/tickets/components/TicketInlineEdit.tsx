import type { ReactNode } from 'react';
import type { User } from '@/types';
import {
  TicketStatus,
  TicketPriority,
  TicketCategory,
} from '@artco-group/artco-ticketing-sync';
import {
  Badge,
  Avatar,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/shared/components/ui';
import {
  resolveAssigneeName,
  categoryBadgeConfig,
  getPriorityIcon,
  getPriorityLabel,
  getStatusIcon,
  getStatusLabel,
  type AssignedToValue,
} from '@/shared/utils/ticket-helpers';
import {
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  CATEGORY_OPTIONS,
} from '../utils/ticket-options';

interface InlineEditWrapperProps {
  label: string;
  canEdit: boolean;
  isLoading: boolean;
  children: ReactNode;
  displayContent: ReactNode;
}

function InlineEditWrapper({
  label,
  canEdit,
  isLoading,
  children,
  displayContent,
}: InlineEditWrapperProps) {
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isLoading}>
          <button className="m-0 flex cursor-pointer items-center justify-start p-0 text-left transition-opacity hover:opacity-80">
            <span className="text-muted-foreground mr-3 w-20 shrink-0 text-sm">
              {label}
            </span>
            {displayContent}
          </button>
        </DropdownMenuTrigger>
        {children}
      </DropdownMenu>
    </div>
  );
}

// Status Edit Component
interface StatusEditProps {
  value: string;
  canEdit: boolean;
  isLoading: boolean;
  onChange: (status: string) => void;
}

export function StatusEdit({
  value,
  canEdit,
  isLoading,
  onChange,
}: StatusEditProps) {
  const displayContent = (
    <Badge icon={getStatusIcon(value as TicketStatus)}>
      {getStatusLabel(value as TicketStatus)}
    </Badge>
  );

  return (
    <InlineEditWrapper
      label="Status"
      canEdit={canEdit}
      isLoading={isLoading}
      displayContent={displayContent}
    >
      <DropdownMenuContent align="start">
        {STATUS_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="flex cursor-pointer items-center gap-2"
          >
            {getStatusIcon(option.value as TicketStatus)}
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </InlineEditWrapper>
  );
}

// Priority Edit Component
interface PriorityEditProps {
  value: string;
  canEdit: boolean;
  isLoading: boolean;
  onChange: (priority: string) => void;
}

export function PriorityEdit({
  value,
  canEdit,
  isLoading,
  onChange,
}: PriorityEditProps) {
  const displayContent = (
    <Badge icon={getPriorityIcon(value as TicketPriority)}>
      {getPriorityLabel(value as TicketPriority)}
    </Badge>
  );

  return (
    <InlineEditWrapper
      label="Priority"
      canEdit={canEdit}
      isLoading={isLoading}
      displayContent={displayContent}
    >
      <DropdownMenuContent align="start">
        {PRIORITY_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="flex cursor-pointer items-center gap-2"
          >
            {getPriorityIcon(option.value as TicketPriority)}
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </InlineEditWrapper>
  );
}

// Category Edit Component
interface CategoryEditProps {
  value: string;
  canEdit: boolean;
  isLoading: boolean;
  onChange: (category: string) => void;
}

export function CategoryEdit({
  value,
  canEdit,
  isLoading,
  onChange,
}: CategoryEditProps) {
  const displayContent = (
    <Badge icon={<span className="text-xs">🏷️</span>}>
      {categoryBadgeConfig[value as TicketCategory]?.label || value}
    </Badge>
  );

  return (
    <InlineEditWrapper
      label="Category"
      canEdit={canEdit}
      isLoading={isLoading}
      displayContent={displayContent}
    >
      <DropdownMenuContent align="start">
        {CATEGORY_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="flex cursor-pointer items-center gap-2"
          >
            <span className="text-xs">🏷️</span>
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </InlineEditWrapper>
  );
}

// Assignee Edit Component
interface AssigneeEditProps {
  value: AssignedToValue;
  users: User[];
  developerUsers: User[];
  canEdit: boolean;
  isLoading: boolean;
  onChange: (userId: string) => void;
}

export function AssigneeEdit({
  value,
  users,
  developerUsers,
  canEdit,
  isLoading,
  onChange,
}: AssigneeEditProps) {
  const displayContent = value ? (
    <div className="flex items-center gap-2">
      <Avatar size="sm" fallback={resolveAssigneeName(value, users)} />
      <span className="text-sm">{resolveAssigneeName(value, users)}</span>
    </div>
  ) : (
    <span className="text-sm text-orange-600">Unassigned</span>
  );

  return (
    <InlineEditWrapper
      label="Assignee"
      canEdit={canEdit}
      isLoading={isLoading}
      displayContent={displayContent}
    >
      <DropdownMenuContent align="start">
        {developerUsers.map((dev) => (
          <DropdownMenuItem
            key={dev._id || dev.id}
            onClick={() => onChange(dev._id || dev.id || '')}
            className="flex cursor-pointer items-center gap-2"
          >
            <Avatar size="sm" fallback={dev.name || dev.email || ''} />
            <span>{dev.name || dev.email}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </InlineEditWrapper>
  );
}
