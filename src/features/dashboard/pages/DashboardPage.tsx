import { useAuth } from '@/features/auth/context';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-greyscale-900 mb-4 text-2xl font-bold">Dashboard</h1>
      <p className="text-greyscale-600">
        Welcome back{user?.name ? `, ${user.name}` : ''}!
      </p>
    </div>
  );
}
