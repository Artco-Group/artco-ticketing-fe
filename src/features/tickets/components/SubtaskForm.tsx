import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button, Input } from '@/shared/components/ui';
import { Icon } from '@/shared/components/ui';

interface SubtaskFormProps {
  onSubmit: (title: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function SubtaskForm({
  onSubmit,
  isLoading = false,
  placeholder = 'Add a subtask...',
}: SubtaskFormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim());
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={placeholder}
        disabled={isLoading}
        className="flex-1"
      />
      <Button
        type="submit"
        size="sm"
        disabled={!title.trim() || isLoading}
        loading={isLoading}
      >
        <Icon name="plus" size="sm" />
      </Button>
    </form>
  );
}
