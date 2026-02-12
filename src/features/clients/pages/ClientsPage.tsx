import {
  RetryableError,
  EmptyState,
  Modal,
  ConfirmationDialog,
  Button,
} from '@/shared/components/ui';
import { ListPageLayout } from '@/shared/components/layout/ListPageLayout';
import { ClientTable } from '../components/ClientTable';
import UserForm from '@/features/users/components/UserForm';
import { useClientList } from '../hooks/useClientList';

const SORT_OPTIONS = ['Name', 'Email', 'Joined'];

export default function ClientsPage() {
  const {
    clients,
    sortedClients,
    editingClient,
    clientToDelete,
    isLoading,
    error,
    refetch,
    isSubmitting,
    sortBy,
    showFormModal,
    setSortBy,
    setClientToDelete,
    onAddClient,
    onEditClient,
    onCloseFormModal,
    onFormSubmit,
    onConfirmDelete,
  } = useClientList();

  return (
    <>
      <ListPageLayout
        title="Clients"
        count={clients.length}
        loading={isLoading}
        loadingMessage="Loading clients..."
        showAddButton
        onAddClick={onAddClient}
        addButtonLabel="Add Client"
        sortOptions={SORT_OPTIONS}
        sortValue={sortBy}
        onSortChange={setSortBy}
      >
        {error ? (
          <RetryableError
            title="Failed to load clients"
            message="Failed to load clients. Please try again later."
            onRetry={refetch}
          />
        ) : clients.length === 0 ? (
          <EmptyState
            variant="no-users"
            title="No clients found"
            message="No clients have been added yet."
          />
        ) : (
          <ClientTable
            clients={sortedClients}
            onEdit={onEditClient}
            onDelete={setClientToDelete}
          />
        )}
      </ListPageLayout>

      <Modal
        isOpen={showFormModal}
        onClose={onCloseFormModal}
        title={editingClient ? 'Edit Client' : 'Add New Client'}
        size="md"
        actions={
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCloseFormModal}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" form="client-form" disabled={isSubmitting}>
              {isSubmitting
                ? 'Saving...'
                : editingClient
                  ? 'Save Changes'
                  : 'Add Client'}
            </Button>
          </div>
        }
      >
        <UserForm
          key={editingClient?.id || 'new'}
          formId="client-form"
          onSubmit={onFormSubmit}
          defaultValues={
            editingClient
              ? {
                  name: editingClient.name || '',
                  email: editingClient.email || '',
                }
              : undefined
          }
          isEditing={!!editingClient}
          isSubmitting={isSubmitting}
          userId={editingClient?.id}
          currentAvatar={editingClient?.profilePic}
          isClient
        />
      </Modal>

      <ConfirmationDialog
        isOpen={!!clientToDelete}
        onClose={() => setClientToDelete(null)}
        onConfirm={onConfirmDelete}
        title="Delete Client"
        description={`Are you sure you want to delete ${clientToDelete?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        isLoading={isSubmitting}
        icon="trash"
      />
    </>
  );
}
