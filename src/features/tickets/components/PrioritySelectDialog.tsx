import { TicketPriority } from '@/types';
import { Button } from '@/shared/components/ui';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import {
  getPriorityIcon,
  getPriorityLabel,
} from '@/shared/utils/ticket-helpers';

const PRIORITY_OPTIONS: TicketPriority[] = [
  TicketPriority.CRITICAL,
  TicketPriority.HIGH,
  TicketPriority.MEDIUM,
  TicketPriority.LOW,
];

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
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[360px]">
        <DialogHeader>
          <DialogTitle>Change Priority</DialogTitle>
          <DialogDescription>
            Select a new priority for {selectedCount} ticket
            {selectedCount > 1 ? 's' : ''}.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-2">
          {PRIORITY_OPTIONS.map((priority) => (
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
      </DialogContent>
    </Dialog>
  );
}
