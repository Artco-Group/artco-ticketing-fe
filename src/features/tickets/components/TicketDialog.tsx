import { useEffect } from 'react';
import { type Ticket } from '@artco-group/artco-ticketing-sync';
import { SideDialog, Button } from '@/shared/components/ui';
import { useAuth } from '@/features/auth/context';
import { useRoleFlags } from '@/shared';
import { useAppTranslation } from '@/shared/hooks';
import {
  useTicketDialogForm,
  useTicketDialogActions,
  useProjectMembers,
} from '../hooks';
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
  const { translate } = useAppTranslation('tickets');
  const { user } = useAuth();
  const { isEngLead, isAdmin, isDeveloper } = useRoleFlags(user?.role);
  const isProjectLocked = !!projectId;
  const canAssign = isEngLead || isAdmin;
  const canSetSolutionDates = isEngLead || isAdmin || isDeveloper;

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

  const selectedProjectId = projectId || form.watch('project');
  const { projectOptions, developerUsers, engLeadUsers } =
    useProjectMembers(selectedProjectId);

  useEffect(() => {
    if (!isEditing && engLeadUsers.length === 1) {
      const currentEngLead = form.getValues('engLead');
      if (!currentEngLead) {
        form.setValue('engLead', engLeadUsers[0].id || '');
      }
    }
  }, [engLeadUsers, isEditing, form]);

  const formId = 'ticket-dialog-form';

  return (
    <SideDialog
      isOpen={isOpen}
      onClose={handleClose}
      title={
        isEditing
          ? translate('dialog.editTitle')
          : translate('dialog.createTitle')
      }
      description={
        isEditing
          ? translate('dialog.editDescription')
          : translate('dialog.createDescription')
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
            {translate('dialog.cancel')}
          </Button>
          <Button
            type="submit"
            form={formId}
            disabled={isPending || (isEditing && !form.formState.isDirty)}
          >
            {isPending
              ? isEditing
                ? translate('dialog.saving')
                : translate('dialog.creating')
              : isEditing
                ? translate('dialog.save')
                : translate('create')}
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
        engLeadUsers={engLeadUsers}
        canAssign={canAssign}
        canSetSolutionDates={canSetSolutionDates}
      />
    </SideDialog>
  );
}

export default TicketDialog;
