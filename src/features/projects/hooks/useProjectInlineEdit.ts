import { useToast } from '@/shared/components/ui';
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
  const toast = useToast();
  const updateProject = useUpdateProject();

  const handleStartDateChange = async (date: string | null) => {
    if (!projectId) return;
    try {
      await updateProject.mutateAsync({
        slug: projectId,
        data: { startDate: date || undefined },
      });
      toast.success('Start date updated');
    } catch {
      toast.error('Failed to update start date');
    }
  };

  const handleDueDateChange = async (date: string | null) => {
    if (!projectId) return;
    try {
      await updateProject.mutateAsync({
        slug: projectId,
        data: { dueDate: date || undefined },
      });
      toast.success('Due date updated');
    } catch {
      toast.error('Failed to update due date');
    }
  };

  return {
    canEditDates: canEdit,
    isDatesUpdating: updateProject.isPending,
    onStartDateChange: handleStartDateChange,
    onDueDateChange: handleDueDateChange,
  };
}
