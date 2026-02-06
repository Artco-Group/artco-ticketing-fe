import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { Icon } from './Icon';

export interface SideDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl';
}

const widthClasses = {
  sm: 'w-[384px]',
  md: 'w-[448px]',
  lg: 'w-[512px]',
  xl: 'w-[640px]',
};

/**
 * Side dialog component that slides in from the right
 * Uses Radix Dialog primitive for accessibility
 */
export function SideDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  width = 'md',
}: SideDialogProps) {
  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />
        <DialogPrimitive.Content
          className={cn(
            'bg-background fixed top-0 right-0 bottom-0 z-50 flex h-full flex-col border-l shadow-xl',
            widthClasses[width],
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
            'duration-300 ease-in-out'
          )}
        >
          {/* Header */}
          <div className="shrink-0 border-b px-6 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <DialogPrimitive.Title className="text-lg font-semibold">
                  {title}
                </DialogPrimitive.Title>
                {description && (
                  <DialogPrimitive.Description className="text-muted-foreground mt-1 text-sm">
                    {description}
                  </DialogPrimitive.Description>
                )}
              </div>
              <DialogPrimitive.Close
                className="text-muted-foreground hover:text-foreground hover:bg-muted shrink-0 rounded-md p-1 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
                aria-label="Close"
              >
                <Icon name="x" size="md" />
              </DialogPrimitive.Close>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
