import { useAuth } from '@/features/auth/context';
import { PageHeader } from '@/shared/components/patterns/PageHeader';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <PageHeader title="Dashboard" />
      <div className="flex-1 p-6">
        <p className="text-greyscale-600">
          Welcome back{user?.name ? `, ${user.name}` : ''}!
        </p>
      </div>
    </div>
  );
}
