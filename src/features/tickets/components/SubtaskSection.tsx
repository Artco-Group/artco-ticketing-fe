import { type TicketId } from '@/types';
import { SubtaskList } from './SubtaskList';
import { SubtaskForm } from './SubtaskForm';
import { Progress, Icon } from '@/shared/components/ui';
import { useSubtasksHook } from '../hooks';
import { useAppTranslation } from '@/shared/hooks';

interface SubtaskSectionProps {
  ticketId: TicketId;
  canEdit: boolean;
  canToggle?: boolean;
}

export function SubtaskSection({
  ticketId,
  canEdit,
  canToggle = false,
}: SubtaskSectionProps) {
  const { translate } = useAppTranslation('tickets');
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
    onReorder,
  } = useSubtasksHook({ ticketId });

  if (isError) {
    return null;
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Icon
            name="double-check"
            size="md"
            className="text-muted-foreground"
          />
          {translate('subtasks.title')}
        </h3>
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
            {translate('details.loading')}
          </p>
        ) : (
          <>
            <SubtaskList
              subtasks={subtasks}
              onToggle={onToggle}
              onUpdate={canEdit ? onUpdate : undefined}
              onDelete={canEdit ? onDelete : undefined}
              onReorder={canEdit ? onReorder : undefined}
              isLoading={isMutating}
              canEdit={canEdit}
              canToggle={canToggle}
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
