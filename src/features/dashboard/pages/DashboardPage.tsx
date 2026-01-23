import { useAuth } from '@/features/auth/context';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="text-gray-600">
        Welcome back{user?.name ? `, ${user.name}` : ''}!
      </p>
    </div>
  );
}
