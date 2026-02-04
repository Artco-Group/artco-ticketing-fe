import { Link } from 'react-router-dom';
import { usePasswordResetForm } from '../hooks';
import { PAGE_ROUTES } from '@/shared/constants';
import { Icon } from '@/shared/components/ui';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  PasswordInput,
  Button,
} from '@/shared/components/ui';

export function PasswordResetForm() {
  const {
    form,
    onSubmit,
    isPending,
    verifyingToken,
    tokenValid,
    tokenError,
    formError,
    success,
    navigateToLogin,
  } = usePasswordResetForm();

  // Loading state
  if (verifyingToken) {
    return (
      <div className="text-center">
        <div className="mb-4">
          <div className="border-primary/20 border-t-primary mx-auto h-12 w-12 animate-spin rounded-full border-4"></div>
        </div>
        <p className="text-muted-foreground text-base">Verifying token...</p>
      </div>
    );
  }

  // Invalid token state
  if (!tokenValid) {
    return (
      <div className="text-center">
        <Icon name="info" size="xl" className="text-destructive mb-3" />
        <h2 className="text-foreground max-smx:text-2xl mb-4 text-3xl font-bold tracking-tight">
          Link Expired
        </h2>
        <p className="text-muted-foreground max-smx:text-sm mb-6 text-base">
          {tokenError || 'This password reset link is invalid or has expired.'}
        </p>
        <p className="text-muted-foreground max-smx:text-sm mb-6 text-sm">
          Please request a new password reset link.
        </p>
        <Button onClick={navigateToLogin} className="w-full" size="lg">
          Back to login
        </Button>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Icon name="check-circle" size="xl" className="text-green-600" />
        </div>
        <h2 className="text-foreground max-smx:text-2xl mb-4 text-3xl font-bold tracking-tight">
          Success!
        </h2>
        <p className="text-muted-foreground max-smx:text-sm mb-6 text-base">
          Your password has been reset successfully. Redirecting to login...
        </p>
      </div>
    );
  }

  // Form state
  return (
    <div>
      <div>
        <h2 className="text-foreground max-smx:text-2xl mb-4 text-3xl font-bold tracking-tight">
          New Password
        </h2>
        <p className="text-muted-foreground max-smx:mb-6 max-smx:text-sm mb-8 text-base">
          Enter a new password for your account.
        </p>
      </div>

      {formError && (
        <div className="bg-destructive/10 text-destructive mb-4 rounded-lg p-3 text-sm">
          {formError}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    label="New password"
                    autoComplete="new-password"
                    placeholder="Enter new password"
                    leftIcon={<Icon name="lock" size="md" />}
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
              <FormItem>
                <FormControl>
                  <PasswordInput
                    label="Confirm password"
                    autoComplete="new-password"
                    placeholder="Confirm new password"
                    leftIcon={<Icon name="lock" size="md" />}
                    disabled={isPending}
                    error={fieldState.error?.message}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="mt-2 w-full"
            size="lg"
            loading={isPending}
          >
            {isPending ? 'Resetting...' : 'Reset password'}
          </Button>
        </form>
      </Form>

      <div className="mt-5 text-center">
        <Button
          variant="link"
          className="h-auto p-0 pr-2"
          asChild
          leftIcon="chevron-left"
        >
          <Link to={PAGE_ROUTES.AUTH.LOGIN}>Back to login</Link>
        </Button>
      </div>
    </div>
  );
}
