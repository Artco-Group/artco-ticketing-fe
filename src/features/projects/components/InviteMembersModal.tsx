import { UserRole } from '@artco-group/artco-ticketing-sync';
import { Button, Modal } from '@/shared/components/ui';
import { MemberPicker } from '@/shared/components/composite/MemberPicker';
import { useAppTranslation } from '@/shared/hooks';
import type { useInviteMembers } from '../hooks';

type InviteMembersState = ReturnType<typeof useInviteMembers>;

interface InviteMembersModalProps {
  inviteMembers: InviteMembersState;
}

export default function InviteMembersModal({
  inviteMembers,
}: InviteMembersModalProps) {
  const { translate } = useAppTranslation('projects');

  return (
    <Modal
      isOpen={inviteMembers.isOpen}
      onClose={inviteMembers.closeModal}
      title={translate('detail.inviteTitle')}
      size="md"
      actions={
        <>
          <Button variant="outline" onClick={inviteMembers.closeModal}>
            {translate('detail.cancel')}
          </Button>
          <Button
            onClick={inviteMembers.handleInvite}
            disabled={
              inviteMembers.selectedMembers.length === 0 ||
              inviteMembers.isSubmitting
            }
          >
            {inviteMembers.isSubmitting
              ? translate('detail.adding')
              : translate('detail.addMembers')}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          {translate('detail.inviteDescription')}
        </p>
        <MemberPicker
          value={inviteMembers.selectedMembers}
          options={inviteMembers.availableMembers}
          multiple
          onChange={(value) =>
            inviteMembers.setSelectedMembers(
              Array.isArray(value) ? value : [value]
            )
          }
          placeholder={translate('detail.selectMembers')}
          groupBy="role"
          groups={[
            {
              key: UserRole.ENG_LEAD,
              label: translate('detail.engineeringLeads'),
            },
            {
              key: UserRole.PROJECT_MANAGER,
              label: translate('detail.projectManagers'),
            },
            { key: UserRole.DEVELOPER, label: translate('detail.developers') },
            {
              key: UserRole.TECHNICIAN,
              label: translate('detail.technicians'),
            },
          ]}
        />
      </div>
    </Modal>
  );
}
