import { useState, useEffect, type FormEvent } from 'react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/lib/utils';

interface CommentFormProps {
  onSubmit: (text: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  initialValue?: string;
  submitLabel?: string;
  disabled?: boolean;
}

export function CommentForm({
  onSubmit,
  onCancel,
  placeholder = 'Napišite odgovor...',
  initialValue = '',
  submitLabel = 'Pošalji',
  disabled = false,
}: CommentFormProps) {
  const [text, setText] = useState(initialValue);

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

  const isSubmitDisabled = disabled || !text.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
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
          >
            Odustani
          </Button>
        )}

        <Button
          type="submit"
          variant="default"
          size="sm"
          disabled={isSubmitDisabled}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

export default CommentForm;
