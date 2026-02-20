import { useEffect, useMemo } from 'react';
import { type UpdateUserFormData } from '@artco-group/artco-ticketing-sync';
import { useAuth } from '@/features/auth/context';
import { useUpdateUser } from '@/features/users/api';
import { useUserForm, useProfilePicture } from '@/features/users/hooks';
import { UserRole, asUserId } from '@/types';
import {
  Form,
  FormField,
  FormItem,
  Input,
  Select,
  Avatar,
  Button,
  useToast,
} from '@/shared/components/ui';
import { getErrorMessage } from '@/shared';
import { useAppTranslation } from '@/shared/hooks';

const getDefaultValues = (
  user: { name?: string; email?: string; role?: string } | null
) => ({
  name: user?.name || '',
  email: user?.email || '',
  role: (user?.role as UserRole) || UserRole.DEVELOPER,
});

export function ProfileSettings() {
  const { translate } = useAppTranslation('settings');
  const { translate: translateCommon } = useAppTranslation('common');
  const { translate: translateUsers } = useAppTranslation('users');
  const { user } = useAuth();
  const toast = useToast();
  const updateMutation = useUpdateUser();

  const roleOptions = useMemo(
    () =>
      Object.values(UserRole).map((role) => ({
        label: translateUsers(`roles.${role}`),
        value: role,
      })),
    [translateUsers]
  );

  const userId = user?.id as string | undefined;
  const currentAvatar = user?.profilePic;

  const handleFormSubmit = async (data: UpdateUserFormData) => {
    if (!userId) return;

    try {
      await updateMutation.mutateAsync({
        id: asUserId(userId),
        data,
      });
      toast.success(translate('messages.profileUpdated'));
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const {
    fileInputRef,
    isLoading: isAvatarLoading,
    hasAvatar,
    getAvatarSrc,
    handleFileSelect,
    handleRemove: handleRemoveAvatar,
    openFilePicker,
  } = useProfilePicture({
    userId,
    currentAvatar,
    isEditing: true,
  });

  const { form, createSubmitHandler } = useUserForm({
    defaultValues: getDefaultValues(user),
    isEditing: true,
    onSubmit: handleFormSubmit,
  });

  useEffect(() => {
    if (user) {
      form.reset(getDefaultValues(user));
    }
  }, [user, form]);

  const isSubmitting = updateMutation.isPending;
  const isAdmin = user?.role === UserRole.ADMIN;

  const handleCancel = () => {
    form.reset(getDefaultValues(user));
  };

  return (
    <div className="mx-auto w-full max-w-[540px]">
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-semibold">
          {translate('profile.title')}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {translate('profile.subtitle')}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={createSubmitHandler()} className="space-y-6">
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-foreground mb-4 text-sm font-medium">
              {translate('profile.avatar')}
            </h2>
            <div className="flex items-center gap-4">
              <Avatar
                src={getAvatarSrc()}
                fallback={form.watch('name') || user?.name || 'U'}
                size="xl"
                className="h-20 w-20"
              />
              <div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    disabled={isAvatarLoading || isSubmitting}
                    onClick={openFilePicker}
                  >
                    {isAvatarLoading
                      ? translate('profile.uploading')
                      : translate('profile.uploadImage')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!hasAvatar || isAvatarLoading || isSubmitting}
                    onClick={handleRemoveAvatar}
                  >
                    {translate('profile.remove')}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif"
                    className="hidden"
                    onChange={handleFileSelect}
                    aria-label={translate('profile.uploadImage')}
                  />
                </div>
                <p className="text-muted-foreground mt-2 text-xs">
                  {translate('profile.avatarHint')}
                </p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-8 rounded-lg border bg-white p-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-0">
                  <Input
                    label={translate('profile.name')}
                    placeholder={translate('profile.namePlaceholder')}
                    error={fieldState.error?.message}
                    required
                    {...field}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-0">
                  <Input
                    label={translate('profile.email')}
                    placeholder={translate('profile.emailPlaceholder')}
                    error={fieldState.error?.message}
                    disabled={!isAdmin}
                    {...field}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-0">
                  <Select
                    label={translate('profile.role')}
                    options={roleOptions}
                    placeholder={translate('profile.rolePlaceholder')}
                    error={fieldState.error?.message}
                    disabled={!isAdmin}
                    {...field}
                  />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {translateCommon('buttons.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? translate('profile.saving')
                : translate('profile.saveChanges')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
