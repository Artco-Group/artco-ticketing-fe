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
import { useAppTranslation } from '@/shared/hooks';

export default function ClientsPage() {
  const { translate } = useAppTranslation('clients');
  const { translate: translateCommon } = useAppTranslation('common');
  const sortOptions = [
    translate('table.columns.name'),
    translate('table.columns.email'),
    translate('table.columns.joined'),
  ];

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
        title={translate('title')}
        count={clients.length}
        loading={isLoading}
        loadingMessage={translate('list.loading')}
        showAddButton
        onAddClick={onAddClient}
        addButtonLabel={translate('addClient')}
        sortOptions={sortOptions}
        sortValue={sortBy}
        onSortChange={setSortBy}
      >
        {error ? (
          <RetryableError
            title={translate('list.failedToLoad')}
            message={translate('list.failedToLoadMessage')}
            onRetry={refetch}
          />
        ) : clients.length === 0 ? (
          <EmptyState
            variant="no-users"
            title={translate('list.empty')}
            message={translate('list.emptyDescription')}
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
        title={
          editingClient
            ? translate('form.editTitle')
            : translate('form.addTitle')
        }
        size="md"
        actions={
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCloseFormModal}
              disabled={isSubmitting}
            >
              {translateCommon('buttons.cancel')}
            </Button>
            <Button type="submit" form="client-form" disabled={isSubmitting}>
              {isSubmitting
                ? translateCommon('buttons.saving')
                : editingClient
                  ? translate('form.saveChanges')
                  : translate('addClient')}
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
        title={translate('confirmDelete.title')}
        description={translate('confirmDelete.description', {
          name: clientToDelete?.name,
        })}
        confirmLabel={translate('confirmDelete.confirmLabel')}
        variant="destructive"
        isLoading={isSubmitting}
        icon="trash"
      />
    </>
  );
}
