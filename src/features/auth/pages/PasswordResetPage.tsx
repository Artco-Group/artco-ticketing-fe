import { AuthLayout } from '../components/AuthLayout';
import { PasswordResetForm } from '../components/PasswordResetForm';
import { Icon } from '@/shared/components/ui';

function PasswordResetPage() {
  return (
    <AuthLayout
      headline={
        <>
          Resetovanje
          <br />
          lozinke
        </>
      }
      description="Unesite novu lozinku za vaš račun"
      floatingCards={
        <div className="floating-card max-lgx:py-lg max-lgx:px-4.5 max-mdx:ml-0 max-smx:py-lg max-smx:px-4 max-smx:gap-lg bg-[rgba(255, 255, 255, 0.08)] shadow-card-glass hover:shadow-card-glass-hover ml-[-30px] flex items-start gap-4 rounded-2xl border border-white/12 p-5 backdrop-blur-[20px] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:bg-white/15">
          <div className="max-lgx:w-5xl max-lgx:h-5xl max-smx:w-10 max-smx:h-10 shadow-card-icon-blue card-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-400 to-blue-800 text-white">
            <Icon name="shield-check" size="lg" />
          </div>
          <div className="flex flex-1 flex-col justify-center gap-1.5">
            <span className="text-body-md font-semibold tracking-[-0.2px] text-white">
              Sigurna autentifikacija
            </span>
            <span className="text-body-sm text-white/70">
              Vaši podaci su zaštićeni
            </span>
          </div>
        </div>
      }
    >
      <PasswordResetForm />
    </AuthLayout>
  );
}

export default PasswordResetPage;
