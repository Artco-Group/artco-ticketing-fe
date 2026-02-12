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

  return (
    <div
      className={cn(
        'group flex items-center gap-3 rounded-md px-2 py-2 transition-colors',
        'hover:bg-muted/50',
        subtask.completed && 'opacity-60'
      )}
    >
      {/* Checkbox */}
      <Checkbox
        checked={subtask.completed}
        onCheckedChange={() => handleToggle()}
        disabled={isLoading || !canToggle}
      />

      {/* Title */}
      {isEditing && canEdit ? (
        <div className="flex flex-1 items-center gap-2">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSaveEdit}
            autoFocus
            className="h-8 flex-1"
          />
          <Button size="icon" variant="ghost" onClick={handleSaveEdit}>
            <Icon name="check" size="sm" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleCancelEdit}>
            <Icon name="close" size="sm" />
          </Button>
        </div>
      ) : (
        <span
          className={cn('flex-1 text-sm', subtask.completed && 'line-through')}
          onDoubleClick={() => canEdit && setIsEditing(true)}
        >
          {subtask.title}
        </span>
      )}

      {/* Actions */}
      {canEdit && !isEditing && (
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {onUpdate && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-7 w-7"
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
