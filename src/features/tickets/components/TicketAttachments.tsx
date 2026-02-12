import type { MouseEvent } from 'react';
import {
  type Attachment,
  formatFileSize,
} from '@artco-group/artco-ticketing-sync';
import { Image, FileText, File } from 'lucide-react';
import { Icon } from '@/shared/components/ui';
import type { TicketId } from '@/types';

interface TicketAttachmentsProps {
  attachments: Attachment[];
  ticketId: TicketId;
  onDownload?: (
    ticketId: TicketId,
    index: number,
    filename: string
  ) => Promise<void>;
  onDelete?: (index: number) => void;
  canDelete?: boolean;
}

function getFileIcon(mimetype?: string) {
  if (mimetype?.startsWith('image/')) {
    return <Image className="h-3.5 w-3.5" />;
  } else if (mimetype === 'application/pdf') {
    return <FileText className="text-error-500 h-3.5 w-3.5" />;
  } else {
    return <File className="h-3.5 w-3.5" />;
  }
}

function TicketAttachments({
  attachments,
  ticketId,
  onDownload,
  onDelete,
  canDelete = false,
}: TicketAttachmentsProps) {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  const handleDownload = async (attachment: Attachment, index: number) => {
    if (onDownload) {
      await onDownload(
        ticketId,
        index,
        attachment.filename || attachment.originalName || ''
      );
    }
  };

  const handleDelete = (e: MouseEvent, index: number) => {
    e.stopPropagation();
    onDelete?.(index);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {attachments.map((attachment, index) => (
        <div
          key={index}
          className="flex items-center gap-1.5 rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs"
        >
          <span className="text-muted-foreground">
            {getFileIcon(attachment.mimetype)}
          </span>
          <span className="max-w-[120px] truncate font-medium">
            {attachment.filename || attachment.originalName}
          </span>
          {attachment.size && (
            <span className="text-muted-foreground">
              ({formatFileSize(attachment.size)})
            </span>
          )}
          <button
            type="button"
            onClick={() => handleDownload(attachment, index)}
            className="text-muted-foreground hover:text-foreground ml-0.5 transition-colors"
          >
            <Icon name="download" size="xs" />
          </button>
          {canDelete && (
            <button
              type="button"
              onClick={(e) => handleDelete(e, index)}
              className="text-muted-foreground hover:text-destructive transition-colors"
            >
              <Icon name="close" size="xs" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default TicketAttachments;
