import { Image, FileText, File, Video } from 'lucide-react';
import { Icon } from '@/shared/components/ui';
import { formatFileSize } from '@artco-group/artco-ticketing-sync';

function getFileIcon(mimetype?: string, isVideo?: boolean) {
  if (isVideo) {
    return <Video className="h-3.5 w-3.5" />;
  }
  if (mimetype?.startsWith('image/')) {
    return <Image className="h-3.5 w-3.5" />;
  }
  if (mimetype === 'application/pdf') {
    return <FileText className="h-3.5 w-3.5 text-red-500" />;
  }
  return <File className="h-3.5 w-3.5" />;
}

interface FileItemProps {
  name: string;
  size?: number;
  mimetype?: string;
  duration?: number;
  isVideo?: boolean;
  onDownload?: () => void;
  onDelete?: () => void;
  canDelete?: boolean;
  isDeleting?: boolean;
}

export function FileItem({
  name,
  size,
  mimetype,
  duration,
  isVideo,
  onDownload,
  onDelete,
  canDelete = false,
  isDeleting = false,
}: FileItemProps) {
  const showDuration = isVideo && duration != null && duration > 0;

  return (
    <div className="border-border inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs">
      <span className="text-muted-foreground flex items-center">
        {getFileIcon(mimetype, isVideo)}
      </span>
      <span className="max-w-[150px] truncate font-medium">{name}</span>
      {size != null && size > 0 && (
        <span className="text-muted-foreground">({formatFileSize(size)})</span>
      )}
      {showDuration && (
        <span className="text-muted-foreground">
          ({Math.floor(duration / 60)}:{String(duration % 60).padStart(2, '0')})
        </span>
      )}
      {onDownload && (
        <button
          type="button"
          onClick={onDownload}
          className="text-muted-foreground hover:text-foreground flex items-center transition-colors"
        >
          <Icon name="download" size="xs" />
        </button>
      )}
      {canDelete && onDelete && (
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="text-muted-foreground hover:text-destructive flex items-center transition-colors disabled:opacity-50"
        >
          <Icon name="close" size="xs" />
        </button>
      )}
    </div>
  );
}
