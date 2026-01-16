import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../api';
import { UserManagement } from '../components';
import { useAuth } from '@/features/auth/context';
import { useNavigate } from 'react-router-dom';

interface UserFormData {
  name?: string;
  email?: string;
  role?: string;
  password?: string;
}

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
    formData?: UserFormData
  ) => {
    try {
      if (action === 'add' && formData) {
        await createUserMutation.mutateAsync(formData);
      } else if (action === 'edit' && userId && formData) {
        await updateUserMutation.mutateAsync({ id: userId, data: formData });
      } else if (action === 'delete' && userId) {
        await deleteUserMutation.mutateAsync(userId);
      }
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      alert(`Failed to ${action} user. Please try again.`);
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading users...</div>
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
