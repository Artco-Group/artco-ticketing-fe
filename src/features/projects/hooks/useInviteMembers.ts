import { useState, useMemo } from 'react';
import { type User, type ProjectId } from '@/types';
import { useAddProjectMembers } from '../api/projects-api';
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

    try {
      await addMembersMutation.mutateAsync({
        slug: projectId,
        data: { memberIds: selectedMembers },
      });
      toast.success('Members added successfully');
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
