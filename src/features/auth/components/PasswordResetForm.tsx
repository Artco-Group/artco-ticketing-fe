import { Lock, Eye, EyeOff, Check, ChevronRight } from 'lucide-react';
import { usePasswordResetForm } from '../hooks';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
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
    showNewPassword,
    showConfirmPassword,
    toggleNewPassword,
    toggleConfirmPassword,
    navigateToLogin,
  } = usePasswordResetForm();

  // Loading state
  if (verifyingToken) {
    return (
      <div className="text-center">
        <div className="mb-4">
          <div className="border-brand-primary/20 border-t-brand-primary mx-auto h-12 w-12 animate-spin rounded-full border-4"></div>
        </div>
        <p className="text-[16px] text-[#6b7280]">Verificiranje tokena...</p>
      </div>
    );
  }

  // Invalid token state
  if (!tokenValid) {
    return (
      <div>
        <div>
          <h2 className="max-smx:text-[26px] mb-4 text-[32px] font-bold tracking-[-0.5px] text-[#111827]">
            Nevažeći Token
          </h2>
          <p className="max-smx:mb-6 max-smx:text-[14px] mb-8 text-[16px] leading-normal text-[#6b7280]">
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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#10b981]/10">
            <Check className="h-8 w-8 text-[#10b981]" strokeWidth={2.5} />
          </div>
          <h2 className="max-smx:text-[26px] mb-4 text-[32px] font-bold tracking-[-0.5px] text-[#111827]">
            Uspješno!
          </h2>
          <p className="max-smx:text-[14px] mb-6 text-[16px] leading-normal text-[#6b7280]">
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
        <h2 className="max-smx:text-[26px] mb-4 text-[32px] font-bold tracking-[-0.5px] text-[#111827]">
          Nova Lozinka
        </h2>
        <p className="max-smx:mb-6 max-smx:text-[14px] mb-8 text-[16px] leading-normal text-[#6b7280]">
          Unesite novu lozinku za vaš račun.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-5">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nova Lozinka</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                    <Input
                      type={showNewPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Unesite novu lozinku"
                      className="pr-10 pl-10"
                      disabled={isPending}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                      onClick={toggleNewPassword}
                      aria-label={
                        showNewPassword ? 'Sakrij lozinku' : 'Prikaži lozinku'
                      }
                    >
                      {showNewPassword ? (
                        <EyeOff className="text-muted-foreground h-5 w-5" />
                      ) : (
                        <Eye className="text-muted-foreground h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Potvrdi Lozinku</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="Potvrdite novu lozinku"
                      className="pr-10 pl-10"
                      disabled={isPending}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                      onClick={toggleConfirmPassword}
                      aria-label={
                        showConfirmPassword
                          ? 'Sakrij lozinku'
                          : 'Prikaži lozinku'
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="text-muted-foreground h-5 w-5" />
                      ) : (
                        <Eye className="text-muted-foreground h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
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
                <ChevronRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={navigateToLogin}
          className="text-primary cursor-pointer border-none bg-transparent text-sm font-medium transition-colors duration-200 hover:underline"
        >
          ← Nazad na prijavu
        </button>
      </div>
    </div>
  );
}
