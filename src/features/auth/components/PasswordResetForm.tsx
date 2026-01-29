import { usePasswordResetForm } from '../hooks';
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
          <div className="border-brand-primary/20 border-t-brand-primary mx-auto h-12 w-12 animate-spin rounded-full border-4"></div>
        </div>
        <p className="text-body-md text-greyscale-500">
          Verificiranje tokena...
        </p>
      </div>
    );
  }

  // Invalid token state
  if (!tokenValid) {
    return (
      <div>
        <div>
          <h2 className="max-smx:text-heading-h4 text-heading-h3 text-greyscale-1000 mb-4 font-bold tracking-[-0.5px]">
            Nevažeći Token
          </h2>
          <p className="max-smx:mb-6 max-smx:text-body-sm text-body-md text-greyscale-500 mb-8 leading-normal">
            {tokenError ||
              'Link za resetovanje lozinke je nevažeći ili je istekao.'}
          </p>
        </div>
        <Button onClick={navigateToLogin} className="w-full" size="lg">
          Nazad na prijavu
        </Button>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div>
        <div className="text-center">
          <div className="bg-success-500/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Icon name="check-circle" size="xl" className="text-success-500" />
          </div>
          <h2 className="max-smx:text-heading-h4 text-heading-h3 text-greyscale-1000 mb-4 font-bold tracking-[-0.5px]">
            Uspješno!
          </h2>
          <p className="max-smx:text-body-sm text-body-md text-greyscale-500 mb-6 leading-normal">
            Vaša lozinka je uspješno resetovana. Preusmeravanje na stranicu za
            prijavu...
          </p>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <div>
      <div>
        <h2 className="max-smx:text-heading-h4 text-heading-h3 text-greyscale-1000 mb-4 font-bold tracking-[-0.5px]">
          Nova Lozinka
        </h2>
        <p className="max-smx:mb-6 max-smx:text-body-sm text-body-md text-greyscale-500 mb-8 leading-normal">
          Unesite novu lozinku za vaš račun.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-5">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    label="Nova Lozinka"
                    autoComplete="new-password"
                    placeholder="Unesite novu lozinku"
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
                    label="Potvrdi Lozinku"
                    autoComplete="new-password"
                    placeholder="Potvrdite novu lozinku"
                    leftIcon={<Icon name="lock" size="md" />}
                    disabled={isPending}
                    error={fieldState.error?.message}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {formError && (
            <div className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
              {formError}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                Resetovanje...
              </>
            ) : (
              <>
                Resetuj Lozinku
                <Icon name="chevron-right" size="md" className="ml-2" />
              </>
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={navigateToLogin}
          className="link text-sm"
        >
          ← Nazad na prijavu
        </button>
      </div>
    </div>
  );
}
