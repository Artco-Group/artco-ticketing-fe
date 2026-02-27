import { useState, type KeyboardEvent } from 'react';
import { type User } from '@artco-group/artco-ticketing-sync';
import { Modal, Input, Button, Badge, Icon } from '@/shared/components/ui';
import { useAppTranslation } from '@/shared/hooks';

interface ContractsModalProps {
  client: User | null;
  onClose: () => void;
  onSave: (clientId: string, contracts: string[]) => void;
  isSubmitting?: boolean;
}

export function ContractsModal({
  client,
  onClose,
  onSave,
  isSubmitting = false,
}: ContractsModalProps) {
  const { translate } = useAppTranslation('clients');
  const { translate: translateCommon } = useAppTranslation('common');
  const [contracts, setContracts] = useState<string[]>(client?.contracts || []);
  const [contractInput, setContractInput] = useState('');

  const handleAdd = () => {
    const trimmed = contractInput.trim();
    if (trimmed && !contracts.includes(trimmed)) {
      setContracts([...contracts, trimmed]);
      setContractInput('');
    }
  };

  const handleRemove = (contract: string) => {
    setContracts(contracts.filter((c) => c !== contract));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleSave = () => {
    if (client?.id) {
      onSave(client.id, contracts);
    }
  };

  return (
    <Modal
      isOpen={!!client}
      onClose={onClose}
      title={translate('contracts.title', { name: client?.name })}
      size="md"
      actions={
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {translateCommon('buttons.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting
              ? translateCommon('buttons.saving')
              : translateCommon('buttons.save')}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={contractInput}
            onChange={(e) => setContractInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={translate('form.contractsPlaceholder')}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAdd}
            disabled={!contractInput.trim()}
          >
            {translate('form.addContract')}
          </Button>
        </div>

        {contracts.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {contracts.map((contract) => (
              <Badge
                key={contract}
                variant="secondary"
                size="sm"
                className="gap-1"
              >
                {contract}
                <button
                  type="button"
                  onClick={() => handleRemove(contract)}
                  className="hover:text-destructive ml-0.5"
                >
                  <Icon name="close" size="xs" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            {translate('form.noContracts')}
          </p>
        )}
      </div>
    </Modal>
  );
}
