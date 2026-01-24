import {
  type Attachment,
  formatFileSize,
} from '@artco-group/artco-ticketing-sync';
import { Image, FileText, File, Download } from 'lucide-react';

interface TicketAttachmentsProps {
  attachments: Attachment[];
  ticketId: string;
  onDownload?: (
    ticketId: string,
    index: number,
    filename: string
  ) => Promise<void>;
}

function getFileIcon(mimetype?: string) {
  if (mimetype?.startsWith('image/')) {
    return <Image className="h-5 w-5" />;
  } else if (mimetype === 'application/pdf') {
    return <FileText className="text-error-500 h-5 w-5" />;
  } else {
    return <File className="h-5 w-5" />;
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
    <div className="mt-6">
      <h3 className="text-greyscale-700 mb-3 text-sm font-semibold">
        Attachments ({attachments.length})
      </h3>
      <div className="space-y-2">
        {attachments.map((attachment, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 transition-colors hover:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="text-brand-primary flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                {getFileIcon(attachment.mimetype)}
              </div>
              <div>
                <p className="text-greyscale-900 text-sm font-medium">
                  {attachment.filename || attachment.originalName}
                </p>
                {attachment.size && (
                  <p className="text-greyscale-500 text-xs">
                    {formatFileSize(attachment.size)}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => handleDownload(attachment, index)}
              className="bg-brand-primary hover:bg-brand-primary-dark flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
            >
              <Download className="h-4 w-4" />
              Preuzmi
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TicketAttachments;
