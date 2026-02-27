import { useState } from 'react';
import { Button, Textarea, Modal } from '@/shared/components/ui';
import { useAppTranslation } from '@/shared/hooks';

interface ResolutionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (resolution: string) => void;
  onSkip: () => void;
  isLoading?: boolean;
}

export function ResolutionDialog({
  isOpen,
  onClose,
  onSubmit,
  onSkip,
  isLoading = false,
}: ResolutionDialogProps) {
  const { translate } = useAppTranslation('tickets');
  const [resolution, setResolution] = useState('');

  const handleSubmit = () => {
    if (resolution.trim()) {
      onSubmit(resolution.trim());
      setResolution('');
    }
  };

  const handleSkip = () => {
    setResolution('');
    onSkip();
  };

  const handleClose = () => {
    setResolution('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={translate('resolution.title')}
      description={translate('resolution.description')}
      size="sm"
      actions={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleSkip} disabled={isLoading}>
            {translate('resolution.skip')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !resolution.trim()}
          >
            {translate('resolution.save')}
          </Button>
        </div>
      }
    >
      <Textarea
        value={resolution}
        onChange={(e) => setResolution(e.target.value)}
        placeholder={translate('resolution.placeholder')}
        rows={4}
        disabled={isLoading}
      />
    </Modal>
  );
}
