import { useMemo } from 'react';
import {
  type Ticket,
  type User,
  UserRole,
} from '@artco-group/artco-ticketing-sync';
import { SideDialog, Button } from '@/shared/components/ui';
import { useAuth } from '@/features/auth/context';
import { useProjects } from '@/features/projects/api/projects-api';
import { useRoleFlags } from '@/shared';
import { useTicketDialogForm, useTicketDialogActions } from '../hooks';
import { TicketForm } from './TicketForm';

interface TicketDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ticket?: Ticket | null;
  projectId?: string;
  onSuccess?: () => void;
}

export function TicketDialog({
  isOpen,
  onClose,
  ticket,
  projectId,
  onSuccess,
}: TicketDialogProps) {
  const { user } = useAuth();
  const { isEngLead, isAdmin } = useRoleFlags(user?.role);
  const isProjectLocked = !!projectId;
  const canAssign = isEngLead || isAdmin;

  const { handleSubmit, isPending } = useTicketDialogActions({
    ticket,
    clientEmail: user?.email,
    onSuccess,
    onClose,
  });

  const { form, isEditing, onSubmit, resetForm } = useTicketDialogForm({
    ticket,
    projectId,
    isOpen,
    onSubmit: handleSubmit,
  });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const { data: projectsData } = useProjects();

  const projectOptions = useMemo(
    () =>
      (projectsData?.projects || []).map((project) => ({
        label: project.name,
        value: (project.id || '') as string,
      })),
    [projectsData?.projects]
  );

  const selectedProjectId = projectId || form.watch('project');

  const developerUsers = useMemo(() => {
    if (!selectedProjectId || !projectsData?.projects) return [];

    const selectedProject = projectsData.projects.find(
      (p) => p.id === selectedProjectId
    );
    if (!selectedProject) return [];

    const members = (selectedProject.members as User[]) || [];
    return members.filter((u) => u.role === UserRole.DEVELOPER);
  }, [selectedProjectId, projectsData]);

  const formId = 'ticket-dialog-form';

  return (
    <SideDialog
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Ticket' : 'Create Ticket'}
      description={
        isEditing
          ? 'Update ticket details.'
          : 'Fill in the details to create a new ticket.'
      }
      width="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form={formId}
            disabled={isPending || (isEditing && !form.formState.isDirty)}
          >
            {isPending
              ? isEditing
                ? 'Saving...'
                : 'Creating...'
              : isEditing
                ? 'Save Changes'
                : 'Create Ticket'}
          </Button>
        </div>
      }
    >
      <TicketForm
        form={form}
        formId={formId}
        onSubmit={onSubmit}
        isEditing={isEditing}
        projectOptions={projectOptions}
        isProjectLocked={isProjectLocked}
        developerUsers={developerUsers}
        canAssign={canAssign}
      />
    </SideDialog>
  );
}

export default TicketDialog;
