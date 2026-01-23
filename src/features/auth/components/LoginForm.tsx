import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { PAGE_ROUTES } from '@/shared/constants';
import { useLoginForm } from '../hooks';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  Checkbox,
} from '@/shared/components/ui';

export function LoginForm() {
  const { form, onSubmit, isPending, showPassword, togglePassword } =
    useLoginForm();

  return (
    <div>
      <div>
        <h2 className="text-foreground max-smx:text-2xl mb-2 text-3xl font-bold tracking-tight">
          Prijavite se
        </h2>
        <p className="text-muted-foreground max-smx:mb-6 max-smx:text-sm mb-8 text-base">
          Dobrodošli nazad. Molimo unesite vaše podatke.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email adresa</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="vase.ime@kompanija.ba"
                      className="pl-10"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lozinka</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Unesite vašu lozinku"
                      className="pr-10 pl-10"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
                      onClick={togglePassword}
                      aria-label={
                        showPassword ? 'Sakrij lozinku' : 'Prikaži lozinku'
                      }
                    >
                      {showPassword ? (
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

          <div className="max-smx:flex-col max-smx:items-start max-smx:gap-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember-me" />
              <label
                htmlFor="remember-me"
                className="text-muted-foreground cursor-pointer text-sm"
              >
                Zapamti me
              </label>
            </div>
            <Link
              to={PAGE_ROUTES.AUTH.FORGOT_PASSWORD}
              className="text-primary text-sm font-medium hover:underline"
            >
              Zaboravljena lozinka?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isPending}
          >
            {isPending ? 'Prijavljivanje...' : 'Prijavite se'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>
      </Form>

      <div className="mt-7 text-center">
        <p className="text-muted-foreground text-sm">
          Nemate račun?{' '}
          <a
            href="https://www.artcogroup.ba/page/contact"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-medium hover:underline"
          >
            Kontaktirajte administratora
          </a>
        </p>
      </div>
    </div>
  );
}
