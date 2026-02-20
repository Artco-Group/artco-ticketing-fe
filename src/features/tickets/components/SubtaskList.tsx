import type { KeyboardEvent } from 'react';
import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type Subtask } from '@artco-group/artco-ticketing-sync';
import { Button, Input, Checkbox } from '@/shared/components/ui';
import { Icon } from '@/shared/components/ui';
import { cn } from '@/lib/utils';
import { useAppTranslation } from '@/shared/hooks';

interface SubtaskListProps {
  subtasks: Subtask[];
  onToggle: (subtaskId: string) => void;
  onUpdate?: (subtaskId: string, title: string) => void;
  onDelete?: (subtaskId: string) => void;
  onReorder?: (subtaskIds: string[]) => void;
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
  isDraggable?: boolean;
}

function SubtaskItem({
  subtask,
  onToggle,
  onUpdate,
  onDelete,
  isLoading,
  canEdit = false,
  canToggle = false,
  isDraggable = false,
}: SubtaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(subtask.title);

  const subtaskId = subtask.id || '';

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: subtaskId, disabled: !isDraggable || isEditing });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

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
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-center gap-3 rounded-md px-2 py-2 transition-colors',
        'hover:bg-muted/50',
        subtask.completed && 'opacity-60',
        canToggle && !isEditing && 'cursor-pointer',
        isDragging && 'bg-background shadow-md'
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
      {isDraggable && (
        <button
          type="button"
          className={cn(
            'text-muted-foreground hover:text-foreground shrink-0 cursor-grab p-0.5 active:cursor-grabbing',
            'opacity-0 transition-opacity group-hover:opacity-100',
            isEditing && 'pointer-events-none'
          )}
          onClick={(e) => e.stopPropagation()}
          {...attributes}
          {...listeners}
        >
          <Icon name="grip" size="sm" />
        </button>
      )}

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
  onReorder,
  isLoading = false,
  canEdit = false,
  canToggle = false,
}: SubtaskListProps) {
  const { translate } = useAppTranslation('tickets');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && onReorder) {
      const oldIndex = subtasks.findIndex((s) => s.id === active.id);
      const newIndex = subtasks.findIndex((s) => s.id === over.id);

      const newSubtasks = [...subtasks];
      const [removed] = newSubtasks.splice(oldIndex, 1);
      newSubtasks.splice(newIndex, 0, removed);

      const newOrder = newSubtasks.map((s) => s.id).filter(Boolean) as string[];
      onReorder(newOrder);
    }
  };

  if (subtasks.length === 0) {
    return (
      <p className="text-muted-foreground py-4 text-center text-sm">
        {translate('subtasks.noSubtasks')}
      </p>
    );
  }

  const isDraggable = canEdit && !!onReorder;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={subtasks.map((s) => s.id || '')}
        strategy={verticalListSortingStrategy}
      >
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
              isDraggable={isDraggable}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
