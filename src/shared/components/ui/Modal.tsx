import type { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from './dialog';
import { Icon } from './Icon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  preventClose?: boolean;
}

const sizesClasses = {
  sm: 'modal-sm',
  md: 'modal-md',
  lg: 'modal-lg',
  xl: 'modal-xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
  size = 'md',
  preventClose,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={sizesClasses[size]} preventClose={preventClose}>
        <div
          className={`flex justify-between ${description ? 'items-start' : 'items-center'}`}
        >
          <div className="pr-8">
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <p className="text-muted-foreground mt-3 text-sm">
                {description}
              </p>
            )}
          </div>
          <DialogClose className="text-greyscale-500 hover:text-greyscale-700 -mr-2 rounded-sm p-1 transition-colors focus:outline-none">
            <Icon name="close" size="md" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>
        <div className="border-border -mx-6 mt-3 border-t" />
        <div className="mt-4">{children}</div>
        {actions && (
          <>
            <div className="border-border -mx-6 mt-6 border-t" />
            <DialogFooter className="pt-5">{actions}</DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
