import { useState, useMemo } from 'react';
import { type User, type ProjectId } from '@/types';
import { useAddProjectMembers } from '../api/projects-api';
import { useTranslatedToast } from '@/shared/hooks';
import { useToast } from '@/shared/components/ui';
import { getErrorMessage } from '@/shared';

interface UseInviteMembersOptions {
  projectId: ProjectId | undefined;
  currentMembers: User[] | undefined;
  allUsers: User[];
}

export function useInviteMembers({
  projectId,
  currentMembers,
  allUsers,
}: UseInviteMembersOptions) {
  const translatedToast = useTranslatedToast();
  const toast = useToast();
  const addMembersMutation = useAddProjectMembers();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const availableMembers = useMemo(() => {
    const currentMemberIds = new Set(currentMembers?.map((m) => m.id) || []);
    return allUsers.filter(
      (user) =>
        (user.role === 'developer' || user.role === 'eng_lead') &&
        !currentMemberIds.has(user.id)
    );
  }, [allUsers, currentMembers]);

  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setIsOpen(false);
    setSelectedMembers([]);
  };

  const handleInvite = async () => {
    if (!projectId || selectedMembers.length === 0) return;

    const memberEmails = selectedMembers
      .map((id) => allUsers.find((u) => u.id === id)?.email)
      .filter((email): email is string => !!email);

    if (memberEmails.length === 0) return;

    try {
      await addMembersMutation.mutateAsync({
        slug: projectId,
        data: { memberEmails },
      });
      translatedToast.success('toast.success.membersAdded');
      closeModal();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return {
    isOpen,
    selectedMembers,
    availableMembers,
    isSubmitting: addMembersMutation.isPending,
    openModal,
    closeModal,
    setSelectedMembers,
    handleInvite,
  };
}
