import { useTranslatedToast } from '@/shared/hooks';
import { useUpdateProject } from '../api/projects-api';
import type { ProjectId } from '@/types';

interface UseProjectInlineEditProps {
  projectId: ProjectId | undefined;
  canEdit: boolean;
}

export function useProjectInlineEdit({
  projectId,
  canEdit,
}: UseProjectInlineEditProps) {
  const translatedToast = useTranslatedToast();
  const updateProject = useUpdateProject();

  const handleStartDateChange = async (date: string | null) => {
    if (!projectId) return;
    try {
      await updateProject.mutateAsync({
        slug: projectId,
        data: { startDate: date },
      });
      translatedToast.success('toast.success.startDateUpdated');
    } catch {
      translatedToast.error('toast.error.failedToUpdate', {
        item: 'start date',
      });
    }
  };

  const handleDueDateChange = async (date: string | null) => {
    if (!projectId) return;
    try {
      await updateProject.mutateAsync({
        slug: projectId,
        data: { dueDate: date },
      });
      translatedToast.success('toast.success.dueDateUpdated');
    } catch {
      translatedToast.error('toast.error.failedToUpdate', { item: 'due date' });
    }
  };

  return {
    canEditDates: canEdit,
    isDatesUpdating: updateProject.isPending,
    onStartDateChange: handleStartDateChange,
    onDueDateChange: handleDueDateChange,
  };
}
