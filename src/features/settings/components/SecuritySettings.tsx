import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '@artco-group/artco-ticketing-sync';
import { useChangePassword } from '@/features/auth/api';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  PasswordInput,
  Button,
  useToast,
} from '@/shared/components/ui';
import { getErrorMessage } from '@/shared';

export function SecuritySettings() {
  const toast = useToast();
  const changePassword = useChangePassword();
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    setFormError(null);
    try {
      await changePassword.mutateAsync(data);
      toast.success('Password changed successfully');
      form.reset();
    } catch (error) {
      const message = getErrorMessage(error);
      setFormError(message);
      toast.error(message);
    }
  });

  const handleCancel = () => {
    form.reset();
    setFormError(null);
  };

  const isPending = changePassword.isPending;
  const isDirty = form.formState.isDirty;

  const watchedFields = useWatch({
    control: form.control,
    name: ['currentPassword', 'newPassword', 'confirmPassword'],
  });
  const allFieldsFilled = watchedFields.every((field) => !!field);

  return (
    <div className="mx-auto w-full max-w-[540px]">
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-semibold">
          Security & Access
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your password, session and other
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-foreground mb-6 text-sm font-medium">
              Password
            </h2>

            {formError && (
              <div className="bg-destructive/10 text-destructive mb-4 rounded-lg p-3 text-sm">
                {formError}
              </div>
            )}

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <PasswordInput
                        label="Current Password"
                        autoComplete="current-password"
                        placeholder="Enter current password"
                        disabled={isPending}
                        error={fieldState.error?.message}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <PasswordInput
                          label="New Password"
                          autoComplete="new-password"
                          placeholder="Enter new password"
                          disabled={isPending}
                          showStrengthMeter
                          error={fieldState.error?.message}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <PasswordInput
                          label="Confirm Password"
                          autoComplete="new-password"
                          placeholder="Confirm password"
                          disabled={isPending}
                          error={fieldState.error?.message}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isPending || !isDirty}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || !allFieldsFilled}>
                {isPending ? 'Saving...' : 'Save Change'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
