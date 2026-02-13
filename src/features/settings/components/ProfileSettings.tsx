import { useEffect } from 'react';
import {
  UserRoleDisplay,
  type UpdateUserFormData,
} from '@artco-group/artco-ticketing-sync';
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

const ROLE_OPTIONS = Object.values(UserRole).map((role) => ({
  label: UserRoleDisplay[role],
  value: role,
}));

const getDefaultValues = (
  user: { name?: string; email?: string; role?: string } | null
) => ({
  name: user?.name || '',
  email: user?.email || '',
  role: (user?.role as UserRole) || UserRole.DEVELOPER,
});

export function ProfileSettings() {
  const { user } = useAuth();
  const toast = useToast();
  const updateMutation = useUpdateUser();

  const userId = user?.id as string | undefined;
  const currentAvatar = user?.profilePic;

  const handleFormSubmit = async (data: UpdateUserFormData) => {
    if (!userId) return;

    try {
      await updateMutation.mutateAsync({
        id: asUserId(userId),
        data,
      });
      toast.success('Profile updated successfully');
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
        <h1 className="text-foreground text-2xl font-semibold">Profile</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your personal information and account settings
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={createSubmitHandler()} className="space-y-6">
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-foreground mb-4 text-sm font-medium">
              Profile Picture
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
                    {isAvatarLoading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!hasAvatar || isAvatarLoading || isSubmitting}
                    onClick={handleRemoveAvatar}
                  >
                    Remove
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif"
                    className="hidden"
                    onChange={handleFileSelect}
                    aria-label="Upload profile picture"
                  />
                </div>
                <p className="text-muted-foreground mt-2 text-xs">
                  We support PNGs, JPEGs and GIFs under 10MB
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
                    label="Name"
                    placeholder="Enter your name"
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
                    label="Email Address"
                    placeholder="Enter email address"
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
                    label="Role"
                    options={ROLE_OPTIONS}
                    placeholder="Select a role"
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
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
