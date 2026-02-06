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

  return (
    <div className="mt-4">
      <h4 className="text-muted-foreground mb-2 text-xs font-medium uppercase">
        Attachments ({attachments.length})
      </h4>
      <div className="flex flex-wrap gap-2">
        {attachments.map((attachment, index) => (
          <button
            key={index}
            onClick={() => handleDownload(attachment, index)}
            className="flex items-center gap-1.5 rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs transition-colors hover:bg-gray-100"
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
            <Icon
              name="download"
              size="xs"
              className="text-muted-foreground ml-0.5"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default TicketAttachments;
