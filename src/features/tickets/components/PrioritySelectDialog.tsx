import { TicketPriority } from '@/types';
import { Button, Modal } from '@/shared/components/ui';
import { getPriorityIcon } from '@/shared/utils/ticket-helpers';
import { useAppTranslation } from '@/shared/hooks';
import { useTranslatedOptions } from '../hooks';

interface PrioritySelectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (priority: TicketPriority) => void;
  selectedCount: number;
  isLoading?: boolean;
}

export function PrioritySelectDialog({
  isOpen,
  onClose,
  onSelect,
  selectedCount,
  isLoading = false,
}: PrioritySelectDialogProps) {
  const { translate } = useAppTranslation('tickets');
  const { getPriorityLabel } = useTranslatedOptions();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={translate('actions.changePriority')}
      description={translate('dialog.selectPriority', { count: selectedCount })}
      size="sm"
    >
      <div className="flex flex-col gap-2">
        {Object.values(TicketPriority).map((priority) => (
          <Button
            key={priority}
            variant="outline"
            className="justify-start gap-3"
            onClick={() => onSelect(priority)}
            disabled={isLoading}
          >
            {getPriorityIcon(priority)}
            {getPriorityLabel(priority)}
          </Button>
        ))}
      </div>
    </Modal>
  );
}
