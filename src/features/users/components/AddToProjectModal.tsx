import { useState } from 'react';
import { Modal, Button, Select, useToast } from '@/shared/components/ui';
import {
  useProjects,
  useAddProjectMembers,
} from '@/features/projects/api/projects-api';
import { getErrorMessage } from '@/shared';
import { type ProjectId, asProjectId } from '@/types';

interface AddToProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  userIds: string[];
  onSuccess?: () => void;
}

export function AddToProjectModal({
  isOpen,
  onClose,
  userIds,
  onSuccess,
}: AddToProjectModalProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<ProjectId>();
  const toast = useToast();

  const { data: projectsData, isLoading: isLoadingProjects } = useProjects();
  const addMembersMutation = useAddProjectMembers();

  const projects = projectsData?.projects || [];

  const projectOptions = projects.map((project) => ({
    label: project.name,
    value: project.slug || '',
  }));

  const handleSubmit = async () => {
    if (!selectedProjectId) {
      toast.error('Please select a project');
      return;
    }

    try {
      await addMembersMutation.mutateAsync({
        slug: selectedProjectId,
        data: { memberIds: userIds },
      });
      toast.success(
        `${userIds.length} user${userIds.length > 1 ? 's' : ''} added to project`
      );
      onSuccess?.();
      handleClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleClose = () => {
    setSelectedProjectId(undefined);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add to Project"
      size="md"
      description={`Add ${userIds.length} selected user${userIds.length > 1 ? 's' : ''} to a project`}
      actions={
        <>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={addMembersMutation.isPending}
            disabled={!selectedProjectId || isLoadingProjects}
          >
            Add to Project
          </Button>
        </>
      }
    >
      <Select
        label="Select Project"
        placeholder="Choose a project..."
        options={projectOptions}
        value={selectedProjectId}
        onChange={(value) => setSelectedProjectId(asProjectId(value))}
        disabled={isLoadingProjects}
      />
    </Modal>
  );
}
