import { useRef, useState, type ChangeEvent } from 'react';
import {
  VALIDATION_RULES,
  ALLOWED_FILE_TYPES,
} from '@artco-group/artco-ticketing-sync';
import { asUserId } from '@/types';
import { useTranslatedToast } from '@/shared/hooks';
import { useUploadAvatar, useRemoveAvatar } from '../api';

interface UseProfilePictureOptions {
  userId?: string;
  currentAvatar?: string;
  isEditing?: boolean;
}

export function useProfilePicture({
  userId,
  currentAvatar,
  isEditing = false,
}: UseProfilePictureOptions) {
  const translatedToast = useTranslatedToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isRemoved, setIsRemoved] = useState(false);

  const uploadMutation = useUploadAvatar();
  const removeMutation = useRemoveAvatar();

  const isLoading = uploadMutation.isPending || removeMutation.isPending;

  const getAvatarSrc = () => {
    if (avatarPreview) return avatarPreview;
    if (isRemoved) return undefined;
    return currentAvatar;
  };

  const hasAvatar = isEditing
    ? (!!currentAvatar && !isRemoved) || !!avatarPreview
    : !!pendingFile;

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.PROFILE_IMAGES.includes(file.type)) {
      translatedToast.error('toast.error.unsupportedFileType');
      return;
    }

    if (file.size > VALIDATION_RULES.MAX_PROFILE_IMAGE_SIZE) {
      translatedToast.error('toast.error.fileTooLarge', { size: '10' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
    };
    reader.onerror = () => {
      translatedToast.error('toast.error.failedToLoad', { item: 'file' });
    };
    reader.readAsDataURL(file);

    if (isEditing && userId) {
      try {
        await uploadMutation.mutateAsync({
          userId: asUserId(userId),
          file,
        });
        setIsRemoved(false);
        translatedToast.success('toast.success.uploaded', {
          item: 'Profile picture',
        });
      } catch {
        translatedToast.error('toast.error.failedToUpload', {
          item: 'profile picture',
        });
        setAvatarPreview(null);
      }
    } else {
      setPendingFile(file);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    if (isEditing && userId) {
      try {
        await removeMutation.mutateAsync(asUserId(userId));
        setAvatarPreview(null);
        setIsRemoved(true);
        translatedToast.success('toast.success.removed', {
          item: 'Profile picture',
        });
      } catch {
        translatedToast.error('toast.error.failedToDelete', {
          item: 'profile picture',
        });
      }
    } else {
      setAvatarPreview(null);
      setPendingFile(null);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return {
    fileInputRef,
    pendingFile,
    isLoading,
    hasAvatar,
    getAvatarSrc,
    handleFileSelect,
    handleRemove,
    openFilePicker,
  };
}
