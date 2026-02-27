import { useState } from 'react';
import { type User } from '@artco-group/artco-ticketing-sync';
import {
  RetryableError,
  EmptyState,
  Modal,
  ConfirmationDialog,
  Button,
} from '@/shared/components/ui';
import { ListPageLayout } from '@/shared/components/layout/ListPageLayout';
import { ClientTable } from '../components/ClientTable';
import { ContractsModal } from '../components/ContractsModal';
import UserForm from '@/features/users/components/UserForm';
import { useClientList, CLIENT_SORT_KEYS } from '../hooks/useClientList';
import { useAppTranslation } from '@/shared/hooks';

const SORT_LABEL_KEYS: Record<(typeof CLIENT_SORT_KEYS)[number], string> = {
  name: 'table.columns.name',
  email: 'table.columns.email',
  joined: 'table.columns.joined',
};

export default function ClientsPage() {
  const { translate } = useAppTranslation('clients');
  const { translate: translateCommon } = useAppTranslation('common');
  const sortOptions = CLIENT_SORT_KEYS.map((key) => ({
    value: key,
    label: translate(SORT_LABEL_KEYS[key]),
  }));

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
    onSaveContracts,
  } = useClientList();

  const [contractsClient, setContractsClient] = useState<User | null>(null);

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
            onManageContracts={setContractsClient}
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
                  contracts: editingClient.contracts || [],
                  canCreateSubClients:
                    editingClient.canCreateSubClients || false,
                }
              : undefined
          }
          isEditing={!!editingClient}
          isSubmitting={isSubmitting}
          userId={editingClient?.id}
          currentAvatar={editingClient?.profilePic}
          isClient
          showAdminFields
        />
      </Modal>

      <ContractsModal
        key={contractsClient?.id}
        client={contractsClient}
        onClose={() => setContractsClient(null)}
        onSave={onSaveContracts}
        isSubmitting={isSubmitting}
      />

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
