import { useChangePasswordForm } from '@/features/auth/hooks';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  PasswordInput,
  Button,
  useToast,
} from '@/shared/components/ui';
import { useAppTranslation } from '@/shared/hooks';

export function SecuritySettings() {
  const { translate } = useAppTranslation('settings');
  const { translate: translateCommon } = useAppTranslation('common');
  const toast = useToast();

  const { form, onSubmit, resetForm, isPending, isDirty, allFieldsFilled } =
    useChangePasswordForm({
      onSuccess: () => {
        toast.success(translate('messages.passwordChanged'));
        resetForm();
      },
      onError: (message) => {
        toast.error(message);
      },
    });

  return (
    <div className="mx-auto w-full max-w-[540px]">
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-semibold">
          {translate('security.title')}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {translate('security.description')}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="rounded-lg border bg-white p-6">
            <h2 className="text-foreground mb-6 text-sm font-medium">
              {translate('security.password')}
            </h2>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <PasswordInput
                        label={translate('security.currentPassword')}
                        autoComplete="current-password"
                        placeholder={translate(
                          'security.currentPasswordPlaceholder'
                        )}
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
                          label={translate('security.newPassword')}
                          autoComplete="new-password"
                          placeholder={translate(
                            'security.newPasswordPlaceholder'
                          )}
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
                          label={translate('security.confirmPassword')}
                          autoComplete="new-password"
                          placeholder={translate(
                            'security.confirmPasswordPlaceholder'
                          )}
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
                onClick={resetForm}
                disabled={isPending || !isDirty}
              >
                {translateCommon('buttons.cancel')}
              </Button>
              <Button type="submit" disabled={isPending || !allFieldsFilled}>
                {isPending
                  ? translate('security.saving')
                  : translate('security.saveChange')}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
