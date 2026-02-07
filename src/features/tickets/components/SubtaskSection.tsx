import { type TicketId } from '@/types';
import { SubtaskList } from './SubtaskList';
import { SubtaskForm } from './SubtaskForm';
import { Progress } from '@/shared/components/ui';
import { useSubtasksHook } from '../hooks';

interface SubtaskSectionProps {
  ticketId: TicketId;
  canEdit: boolean;
}

export function SubtaskSection({ ticketId, canEdit }: SubtaskSectionProps) {
  const {
    subtasks,
    progress,
    isLoading,
    isError,
    isMutating,
    isCreating,
    onCreate,
    onToggle,
    onUpdate,
    onDelete,
  } = useSubtasksHook({ ticketId });

  if (isError) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Subtasks</h3>
        {progress.total > 0 && (
          <div className="flex items-center gap-3">
            <Progress value={progress.percentage} size="sm" showLabel={false} />
            <span className="text-muted-foreground text-sm">
              {progress.completed}/{progress.total}
            </span>
          </div>
        )}
      </div>
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-muted-foreground py-4 text-center text-sm">
            Loading subtasks...
          </p>
        ) : (
          <>
            <SubtaskList
              subtasks={subtasks}
              onToggle={onToggle}
              onUpdate={canEdit ? onUpdate : undefined}
              onDelete={canEdit ? onDelete : undefined}
              isLoading={isMutating}
              canEdit={canEdit}
            />
            {canEdit && (
              <SubtaskForm onSubmit={onCreate} isLoading={isCreating} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
