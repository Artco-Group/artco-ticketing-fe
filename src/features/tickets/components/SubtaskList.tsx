import type { KeyboardEvent } from 'react';
import { useState } from 'react';
import { type Subtask } from '@artco-group/artco-ticketing-sync';
import { Button, Input, Checkbox } from '@/shared/components/ui';
import { Icon } from '@/shared/components/ui';
import { cn } from '@/lib/utils';

interface SubtaskListProps {
  subtasks: Subtask[];
  onToggle: (subtaskId: string) => void;
  onUpdate?: (subtaskId: string, title: string) => void;
  onDelete?: (subtaskId: string) => void;
  isLoading?: boolean;
  canEdit?: boolean;
  canToggle?: boolean;
}

interface SubtaskItemProps {
  subtask: Subtask;
  onToggle: (subtaskId: string) => void;
  onUpdate?: (subtaskId: string, title: string) => void;
  onDelete?: (subtaskId: string) => void;
  isLoading?: boolean;
  canEdit?: boolean;
  canToggle?: boolean;
}

function SubtaskItem({
  subtask,
  onToggle,
  onUpdate,
  onDelete,
  isLoading,
  canEdit = false,
  canToggle = false,
}: SubtaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(subtask.title);

  const subtaskId = subtask.id || '';

  const handleToggle = () => {
    onToggle(subtaskId);
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && onUpdate) {
      onUpdate(subtaskId, editTitle.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(subtask.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleRowClick = () => {
    if (canToggle && !isLoading && !isEditing) {
      handleToggle();
    }
  };

  return (
    <div
      className={cn(
        'group flex items-center gap-3 rounded-md px-2 py-2 transition-colors',
        'hover:bg-muted/50',
        subtask.completed && 'opacity-60',
        canToggle && !isEditing && 'cursor-pointer'
      )}
      onClick={handleRowClick}
      role={canToggle ? 'button' : undefined}
      tabIndex={canToggle && !isEditing ? 0 : undefined}
      onKeyDown={(e) => {
        if (canToggle && !isEditing && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleToggle();
        }
      }}
    >
      <Checkbox
        checked={subtask.completed}
        onCheckedChange={() => handleToggle()}
        disabled={isLoading || !canToggle}
        onClick={(e) => e.stopPropagation()}
      />

      {isEditing && canEdit ? (
        <div
          className="flex flex-1 items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSaveEdit}
            autoFocus
            className="h-8 flex-1"
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={handleSaveEdit}
            aria-label="Save"
          >
            <Icon name="check" size="sm" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCancelEdit}
            aria-label="Cancel"
          >
            <Icon name="close" size="sm" />
          </Button>
        </div>
      ) : (
        <span
          className={cn('flex-1 text-sm', subtask.completed && 'line-through')}
          onDoubleClick={(e) => {
            if (canEdit) {
              e.stopPropagation();
              setIsEditing(true);
            }
          }}
        >
          {subtask.title}
        </span>
      )}

      {canEdit && !isEditing && (
        <div
          className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          {onUpdate && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-7 w-7"
              aria-label="Edit subtask"
            >
              <Icon name="edit" size="xs" />
            </Button>
          )}
          {onDelete && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(subtaskId)}
              className="text-destructive h-7 w-7"
              aria-label="Delete subtask"
            >
              <Icon name="trash" size="xs" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export function SubtaskList({
  subtasks,
  onToggle,
  onUpdate,
  onDelete,
  isLoading = false,
  canEdit = false,
  canToggle = false,
}: SubtaskListProps) {
  if (subtasks.length === 0) {
    return (
      <p className="text-muted-foreground py-4 text-center text-sm">
        No subtasks yet
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {subtasks.map((subtask) => (
        <SubtaskItem
          key={subtask.id}
          subtask={subtask}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
          isLoading={isLoading}
          canEdit={canEdit}
          canToggle={canToggle}
        />
      ))}
    </div>
  );
}
