import { useState } from 'react';
import { Modal, Button, Select, useToast } from '@/shared/components/ui';
import {
  useProjects,
  useAddProjectMembers,
} from '@/features/projects/api/projects-api';
import { useTranslatedToast } from '@/shared/hooks';
import { getErrorMessage } from '@/shared';
import { type ProjectId, asProjectId } from '@/types';

interface AddToProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmails: string[];
  onSuccess?: () => void;
}

export function AddToProjectModal({
  isOpen,
  onClose,
  userEmails,
  onSuccess,
}: AddToProjectModalProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<ProjectId>();
  const translatedToast = useTranslatedToast();
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
      translatedToast.error('toast.error.pleaseSelect', { item: 'project' });
      return;
    }

    try {
      await addMembersMutation.mutateAsync({
        slug: selectedProjectId,
        data: { memberEmails: userEmails },
      });
      translatedToast.success('toast.success.membersAdded');
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
      description={`Add ${userEmails.length} selected user${userEmails.length > 1 ? 's' : ''} to a project`}
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
