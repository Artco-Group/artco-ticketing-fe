import { useState, useEffect, type FormEvent, type KeyboardEvent } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { cn } from '@/lib/utils';
import { useAppTranslation } from '@/shared/hooks';

interface CommentFormProps {
  onSubmit: (text: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  initialValue?: string;
  submitLabel?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export function CommentForm({
  onSubmit,
  onCancel,
  placeholder,
  initialValue = '',
  submitLabel,
  disabled = false,
  isLoading = false,
}: CommentFormProps) {
  const { translate } = useAppTranslation('tickets');
  const [text, setText] = useState(initialValue);

  const resolvedPlaceholder = placeholder ?? translate('comments.placeholder');
  const resolvedSubmitLabel = submitLabel ?? translate('comments.send');

  // Sync with initialValue changes (for edit mode)
  useEffect(() => {
    setText(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedText = text.trim();

    if (!trimmedText || disabled) return;

    onSubmit(trimmedText);
    setText(''); // Reset after submit
  };

  const handleCancel = () => {
    setText(initialValue); // Reset to initial value
    onCancel?.();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const trimmedText = text.trim();
      if (trimmedText && !disabled) {
        onSubmit(trimmedText);
        setText('');
      }
    }
  };

  const isSubmitDisabled = disabled || !text.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={resolvedPlaceholder}
        disabled={disabled}
        rows={3}
        className={cn(
          'border-input w-full rounded-md border bg-transparent px-3 py-2',
          'resize-none text-sm shadow-sm transition-colors',
          'placeholder:text-muted-foreground',
          'focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
      />

      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancel}
            disabled={disabled}
            loading={isLoading}
          >
            {translate('comments.cancel')}
          </Button>
        )}

        <Button
          type="submit"
          variant="default"
          size="sm"
          disabled={isSubmitDisabled}
          loading={isLoading}
        >
          {resolvedSubmitLabel}
        </Button>
      </div>
    </form>
  );
}

export default CommentForm;
