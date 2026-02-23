import { useToast } from '@/shared/components/ui';
import { getErrorMessage } from '@/shared';
import {
  useSubtasks as useSubtasksQuery,
  useCreateSubtask,
  useToggleSubtask,
  useUpdateSubtask,
  useDeleteSubtask,
  useReorderSubtasks,
} from '../api/subtasks-api';
import type { TicketId } from '@/types';

interface UseSubtasksHookProps {
  ticketId: TicketId;
}

/**
 * Custom hook for managing subtasks functionality.
 * Handles all subtask CRUD operations for SubtaskSection component.
 * Follows the same pattern as useComments.
 */
export function useSubtasksHook({ ticketId }: UseSubtasksHookProps) {
  const toast = useToast();

  // Fetch subtasks
  const { data, isLoading, isError, refetch } = useSubtasksQuery(ticketId);

  // Mutations
  const createMutation = useCreateSubtask();
  const toggleMutation = useToggleSubtask();
  const updateMutation = useUpdateSubtask();
  const deleteMutation = useDeleteSubtask();
  const reorderMutation = useReorderSubtasks();

  const subtasks = data?.subtasks ?? [];

  const progress = data?.progress ?? {
    total: 0,
    completed: 0,
    percentage: 0,
  };

  /**
   * Handle creating a new subtask
   */
  const handleCreate = (title: string) => {
    createMutation.mutate(
      { ticketId, title },
      {
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  /**
   * Handle toggling subtask completion status
   */
  const handleToggle = (subtaskId: string) => {
    toggleMutation.mutate(
      { subtaskId, ticketId },
      {
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  /**
   * Handle updating a subtask title
   */
  const handleUpdate = (subtaskId: string, title: string) => {
    updateMutation.mutate(
      { subtaskId, ticketId, title },
      {
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  /**
   * Handle deleting a subtask
   */
  const handleDelete = (subtaskId: string) => {
    deleteMutation.mutate(
      { subtaskId, ticketId },
      {
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  /**
   * Handle reordering subtasks
   */
  const handleReorder = (subtaskIds: string[]) => {
    reorderMutation.mutate(
      { ticketId, subtaskIds },
      {
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  const isMutating =
    createMutation.isPending ||
    toggleMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    reorderMutation.isPending;

  return {
    // Data
    subtasks,
    progress,

    // Loading states
    isLoading,
    isError,
    isMutating,
    isCreating: createMutation.isPending,

    // Actions
    onCreate: handleCreate,
    onToggle: handleToggle,
    onUpdate: handleUpdate,
    onDelete: handleDelete,
    onReorder: handleReorder,

    // Refetch function
    refetch,
  };
}
