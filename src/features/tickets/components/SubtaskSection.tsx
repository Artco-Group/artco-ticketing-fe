import { type TicketId } from '@/types';
import { SubtaskList } from './SubtaskList';
import { SubtaskForm } from './SubtaskForm';
import {
  useSubtasks,
  useCreateSubtask,
  useToggleSubtask,
  useUpdateSubtask,
  useDeleteSubtask,
} from '../api/subtasks-api';
import { useToast, Progress } from '@/shared/components/ui';
import { getErrorMessage } from '@/shared';

interface SubtaskSectionProps {
  ticketId: TicketId;
  canEdit: boolean;
}

export function SubtaskSection({ ticketId, canEdit }: SubtaskSectionProps) {
  const toast = useToast();
  const { data, isLoading, isError } = useSubtasks(ticketId);
  const createSubtask = useCreateSubtask();
  const toggleSubtask = useToggleSubtask();
  const updateSubtask = useUpdateSubtask();
  const deleteSubtask = useDeleteSubtask();

  const subtasks = data?.data?.subtasks || [];
  const progress = data?.data?.progress || {
    total: 0,
    completed: 0,
    percentage: 0,
  };

  const handleCreate = (title: string) => {
    createSubtask.mutate(
      { ticketId, title },
      {
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  const handleToggle = (subtaskId: string) => {
    toggleSubtask.mutate(
      { subtaskId, ticketId },
      {
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  const handleUpdate = (subtaskId: string, title: string) => {
    updateSubtask.mutate(
      { subtaskId, ticketId, title },
      {
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  const handleDelete = (subtaskId: string) => {
    deleteSubtask.mutate(
      { subtaskId, ticketId },
      {
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  const isMutating =
    createSubtask.isPending ||
    toggleSubtask.isPending ||
    updateSubtask.isPending ||
    deleteSubtask.isPending;

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
              onToggle={handleToggle}
              onUpdate={canEdit ? handleUpdate : undefined}
              onDelete={canEdit ? handleDelete : undefined}
              isLoading={isMutating}
              canEdit={canEdit}
            />
            {canEdit && (
              <SubtaskForm
                onSubmit={handleCreate}
                isLoading={createSubtask.isPending}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
