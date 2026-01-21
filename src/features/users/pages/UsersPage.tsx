import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../api';
import { UserManagement } from '../components';
import { useAuth } from '@/features/auth/context';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Skeleton } from '@/shared/components/ui';
import Sidebar from '@/shared/components/layout/Sidebar';
import type {
  CreateUserFormData,
  UpdateUserFormData,
} from '@artco-group/artco-ticketing-sync/types';

export default function UsersPage() {
  const { data, isLoading, error } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const users = data?.users || [];

  const handleUserAction = async (
    action: 'add' | 'edit' | 'delete',
    userId: string | null,
    formData?: CreateUserFormData | UpdateUserFormData
  ) => {
    try {
      if (action === 'add' && formData) {
        await createUserMutation.mutateAsync(formData as CreateUserFormData);
        toast.success('User created successfully');
      } else if (action === 'edit' && userId && formData) {
        await updateUserMutation.mutateAsync({
          id: userId,
          data: formData as UpdateUserFormData,
        });
        toast.success('User updated successfully');
      } else if (action === 'delete' && userId) {
        await deleteUserMutation.mutateAsync(userId);
        toast.success('User deleted successfully');
      }
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      toast.error(`Failed to ${action} user. Please try again.`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigateToTickets = () => {
    navigate('/dashboard');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar
          userEmail={user?.email || ''}
          currentView="users"
          onLogout={handleLogout}
          onNavigateToTickets={handleNavigateToTickets}
          onNavigateToUsers={() => {}}
        />
        <div className="flex flex-1 flex-col">
          <header className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Skeleton className="mb-1 h-4 w-32" />
                <Skeleton className="h-8 w-48" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </header>
          <main className="flex-1 p-6">
            <div className="mb-6 space-y-4">
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <th key={i} className="px-6 py-3">
                          <Skeleton className="h-4 w-24" />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i}>
                        {[1, 2, 3, 4, 5].map((j) => (
                          <td key={j} className="px-6 py-4">
                            <Skeleton className="h-4 w-full" />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Error</h1>
          <p className="mt-2 text-gray-600">
            Failed to load users. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <UserManagement
      users={users}
      userEmail={user?.email || ''}
      onLogout={handleLogout}
      onNavigateToTickets={handleNavigateToTickets}
      onUserAction={handleUserAction}
    />
  );
}
