import {
  RetryableError,
  EmptyState,
  Modal,
  ConfirmationDialog,
  Button,
} from '@/shared/components/ui';
import { ListPageLayout } from '@/shared/components/layout/ListPageLayout';
import { SubClientTable } from '../components/SubClientTable';
import { SubClientForm } from '../components/SubClientForm';
import { useSubClientList } from '../hooks/useSubClientList';
import { useAppTranslation } from '@/shared/hooks';

export default function SubClientsPage() {
  const { translate } = useAppTranslation('subClients');
  const { translate: translateCommon } = useAppTranslation('common');

  const {
    subClients,
    parentProjects,
    editingSubClient,
    subClientToDelete,
    isLoading,
    error,
    refetch,
    isSubmitting,
    showFormModal,
    setSubClientToDelete,
    onAddSubClient,
    onEditSubClient,
    onCloseFormModal,
    onFormSubmit,
    onConfirmDelete,
  } = useSubClientList();

  return (
    <>
      <ListPageLayout
        title={translate('title')}
        count={subClients.length}
        loading={isLoading}
        loadingMessage={translate('list.loading')}
        showAddButton
        onAddClick={onAddSubClient}
        addButtonLabel={translate('addSubClient')}
      >
        {error ? (
          <RetryableError
            title={translate('list.failedToLoad')}
            message={translate('list.failedToLoadMessage')}
            onRetry={refetch}
          />
        ) : subClients.length === 0 ? (
          <EmptyState
            variant="no-users"
            title={translate('list.empty')}
            message={translate('list.emptyDescription')}
          />
        ) : (
          <SubClientTable
            subClients={subClients}
            onEdit={onEditSubClient}
            onDelete={setSubClientToDelete}
          />
        )}
      </ListPageLayout>

      <Modal
        isOpen={showFormModal}
        onClose={onCloseFormModal}
        title={
          editingSubClient
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
            <Button
              type="submit"
              form="sub-client-form"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? translateCommon('buttons.saving')
                : editingSubClient
                  ? translate('form.saveChanges')
                  : translate('addSubClient')}
            </Button>
          </div>
        }
      >
        <SubClientForm
          key={editingSubClient?.id || 'new'}
          formId="sub-client-form"
          onSubmit={onFormSubmit}
          defaultValues={
            editingSubClient
              ? {
                  name: editingSubClient.name || '',
                  email: editingSubClient.email || '',
                  assignedProjects: (
                    editingSubClient.assignedProjects || []
                  ).map((p) => p.id),
                }
              : undefined
          }
          isEditing={!!editingSubClient}
          isSubmitting={isSubmitting}
          parentProjects={parentProjects}
        />
      </Modal>

      <ConfirmationDialog
        isOpen={!!subClientToDelete}
        onClose={() => setSubClientToDelete(null)}
        onConfirm={onConfirmDelete}
        title={translate('confirmDelete.title')}
        description={translate('confirmDelete.description', {
          name: subClientToDelete?.name,
        })}
        confirmLabel={translate('confirmDelete.confirmLabel')}
        variant="destructive"
        isLoading={isSubmitting}
        icon="trash"
      />
    </>
  );
}
