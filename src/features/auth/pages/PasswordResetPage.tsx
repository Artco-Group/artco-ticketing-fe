import { ShieldCheck } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { PasswordResetForm } from '../components/PasswordResetForm';

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
        <div className="floating-card max-lgx:py-3.5 max-lgx:px-4.5 max-mdx:ml-0 max-smx:py-3.4 max-smx:px-4 max-smx:gap-3.5 bg-[rgba(255, 255, 255, 0.08)] ml-[-30px] flex items-start gap-4 rounded-[18px] border border-white/12 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[20px] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:bg-white/15 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
          <div className="max-lgx:w-10.5 max-lgx:h-10.5 max-smx:w-10 max-smx:h-10 shadow-[0_4px_12px_rgba(59, 130, 246, 0.4)] card-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#3b82f6] to-[#1d4ed8] text-white">
            <ShieldCheck className="max-smx:w-5 max-smx:h-5" size={24} />
          </div>
          <div className="flex flex-1 flex-col justify-center gap-1.5">
            <span className="text-[16px] font-semibold tracking-[-0.2px] text-white">
              Sigurna autentifikacija
            </span>
            <span className="text-[13px] text-white/70">
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
