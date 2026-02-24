import { useState, type ReactNode } from 'react';
import { asTicketId, type Ticket, TicketCategory } from '@/types';
import { Icon, Button, Modal } from '@/shared/components/ui';
import { fileAPI } from '../api/file-api';
import { useTicketFileUpload } from '../hooks/useTicketFileUpload';
import { useAppTranslation } from '@/shared/hooks';
import FileUpload from '@/shared/components/common/FileUpload';
import ScreenRecorder from '@/shared/components/common/ScreenRecorder';
import {
  ListOrdered,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  Video,
  Image,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TicketAdditionalDetailsProps {
  ticket: Ticket;
  canUploadFiles: boolean;
}

type MediaTab = 'attachments' | 'recording';

function TicketAdditionalDetails({
  ticket,
  canUploadFiles,
}: TicketAdditionalDetailsProps) {
  const { translate } = useAppTranslation('tickets');
  const [selectedMediaTab, setSelectedMediaTab] =
    useState<MediaTab>('attachments');

  const fileUpload = useTicketFileUpload({ ticketId: ticket.ticketId || '' });

  const isBug = ticket.category === TicketCategory.BUG;
  const hasAttachments = ticket.attachments && ticket.attachments.length > 0;
  const hasRecordings =
    ticket.screenRecordings && ticket.screenRecordings.length > 0;

  // Derive active tab - non-bug tickets can't show recording tab
  const activeMediaTab =
    !isBug && selectedMediaTab === 'recording'
      ? 'attachments'
      : selectedMediaTab;

  return (
    <div className="space-y-0">
      <div className="border-b px-6 py-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-1">
            <TabButton
              active={activeMediaTab === 'attachments'}
              onClick={() => setSelectedMediaTab('attachments')}
              icon={<Paperclip className="h-3.5 w-3.5" />}
              label={translate('details.attachments')}
              count={ticket.attachments?.length || 0}
            />
            {isBug && (
              <TabButton
                active={activeMediaTab === 'recording'}
                onClick={() => setSelectedMediaTab('recording')}
                icon={<Video className="h-3.5 w-3.5" />}
                label={translate('details.screenRecordings')}
                count={ticket.screenRecordings?.length || 0}
              />
            )}
          </div>

          {canUploadFiles && (activeMediaTab === 'attachments' || isBug) && (
            <button
              type="button"
              onClick={
                activeMediaTab === 'attachments'
                  ? fileUpload.openFileUploadModal
                  : fileUpload.openScreenRecordingModal
              }
              disabled={
                activeMediaTab === 'attachments'
                  ? fileUpload.isUploadingFiles
                  : fileUpload.isUploadingScreenRecording
              }
              className="text-primary hover:text-primary/80 flex items-center gap-1 text-xs font-medium transition-colors disabled:opacity-50"
            >
              <Icon name="plus" size="xs" />
              {activeMediaTab === 'attachments'
                ? translate('details.addFiles')
                : translate('details.addRecording')}
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeMediaTab === 'attachments' ? (
          hasAttachments ? (
            <div className="flex flex-wrap gap-4">
              {ticket.attachments!.map((attachment, index) => (
                <MediaThumbnail
                  key={attachment.id || attachment.gcsUrl || index}
                  name={
                    attachment.filename || attachment.originalName || 'File'
                  }
                  size={attachment.size}
                  mimetype={attachment.mimetype}
                  onDownload={() =>
                    fileAPI.downloadAttachment(
                      asTicketId(ticket.ticketId || ''),
                      index,
                      attachment.filename || attachment.originalName || ''
                    )
                  }
                  onDelete={() => fileUpload.handleDeleteAttachment(index)}
                  canDelete={canUploadFiles}
                  isDeleting={fileUpload.deletingAttachmentIndex === index}
                />
              ))}
            </div>
          ) : (
            <EmptyMediaState message={translate('details.noAttachments')} />
          )
        ) : (
          isBug &&
          (hasRecordings ? (
            <div className="flex flex-wrap gap-4">
              {ticket.screenRecordings!.map((recording, index) => (
                <MediaThumbnail
                  key={recording.id || recording.gcsUrl || index}
                  name={
                    recording.originalName ||
                    `screen-recording-${index + 1}.webm`
                  }
                  duration={
                    typeof recording.duration === 'number'
                      ? recording.duration
                      : undefined
                  }
                  isVideo
                  onDownload={() =>
                    fileAPI.downloadScreenRecording(
                      asTicketId(ticket.ticketId || ''),
                      index,
                      recording.originalName ||
                        `screen-recording-${index + 1}.webm`
                    )
                  }
                  onDelete={() => fileUpload.handleDeleteScreenRecording(index)}
                  canDelete={canUploadFiles}
                  isDeleting={fileUpload.deletingRecordingIndex === index}
                />
              ))}
            </div>
          ) : (
            <EmptyMediaState message={translate('details.noRecordings')} />
          ))
        )}
      </div>

      {/* Bug Details Section - Only for bugs */}
      {isBug && (
        <div className="grid grid-cols-1 border-b lg:grid-cols-3">
          <BugDetailSection
            icon={<ListOrdered className="h-4 w-4" />}
            label={translate('details.stepsToReproduce')}
            value={ticket.reproductionSteps}
            className="border-b lg:border-r lg:border-b-0"
          />
          <BugDetailSection
            icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
            label={translate('details.expectedResult')}
            value={ticket.expectedResult}
            accentColor="green"
            className="border-b lg:border-r lg:border-b-0"
          />
          <BugDetailSection
            icon={<AlertCircle className="h-4 w-4 text-red-500" />}
            label={translate('details.actualResult')}
            value={ticket.actualResult}
            accentColor="red"
          />
        </div>
      )}

      {/* File Upload Modal */}
      <Modal
        isOpen={fileUpload.isFileUploadModalOpen}
        onClose={fileUpload.closeFileUploadModal}
        title={translate('details.uploadFiles')}
        size="md"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={fileUpload.closeFileUploadModal}>
              {translate('details.cancel')}
            </Button>
            <Button
              onClick={fileUpload.handleUploadFiles}
              disabled={
                fileUpload.pendingFiles.length === 0 ||
                fileUpload.isUploadingFiles
              }
            >
              {fileUpload.isUploadingFiles
                ? translate('details.uploading')
                : translate('details.upload')}
            </Button>
          </div>
        }
      >
        <FileUpload
          files={fileUpload.pendingFiles}
          onFilesChange={fileUpload.setPendingFiles}
          variant="modal"
        />
      </Modal>

      <Modal
        isOpen={fileUpload.isScreenRecordingModalOpen}
        onClose={fileUpload.closeScreenRecordingModal}
        title={translate('details.recordScreen')}
        size="lg"
        preventClose
      >
        <ScreenRecorder
          onRecordingComplete={fileUpload.handleScreenRecordingComplete}
          disabled={fileUpload.isUploadingScreenRecording}
          variant="modal"
        />
      </Modal>
    </div>
  );
}

function BugDetailSection({
  icon,
  label,
  value,
  accentColor,
  className,
}: {
  icon: ReactNode;
  label: string;
  value?: string | null;
  accentColor?: 'green' | 'red';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'px-6 py-4',
        accentColor === 'green' && 'bg-green-50/50',
        accentColor === 'red' && 'bg-red-50/50',
        className
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="text-muted-foreground flex items-center">{icon}</span>
        <h4 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {label}
        </h4>
      </div>
      <p className="text-sm leading-relaxed whitespace-pre-wrap">
        {value || '-'}
      </p>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
  hasContent,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
  count?: number;
  hasContent?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      {icon}
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            'rounded-full px-1.5 py-0.5 text-[10px]',
            active ? 'bg-primary/20' : 'bg-muted-foreground/20'
          )}
        >
          {count}
        </span>
      )}
      {hasContent && <span className="h-1.5 w-1.5 rounded-full bg-green-500" />}
    </button>
  );
}

function MediaThumbnail({
  name,
  size,
  mimetype,
  duration,
  isVideo,
  onDownload,
  onDelete,
  canDelete,
  isDeleting,
}: {
  name: string;
  size?: number;
  mimetype?: string;
  duration?: number;
  isVideo?: boolean;
  onDownload: () => void;
  onDelete: () => void;
  canDelete: boolean;
  isDeleting: boolean;
}) {
  const isImage = mimetype?.startsWith('image/');
  const isPdf = mimetype === 'application/pdf';

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds || seconds <= 0) return '';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getIconAndColor = () => {
    if (isVideo)
      return {
        icon: <Video className="h-6 w-6" />,
        bg: 'bg-purple-50',
        color: 'text-purple-500',
      };
    if (isImage)
      return {
        icon: <Image className="h-6 w-6" />,
        bg: 'bg-blue-50',
        color: 'text-blue-500',
      };
    if (isPdf)
      return {
        icon: <FileText className="h-6 w-6" />,
        bg: 'bg-red-50',
        color: 'text-red-500',
      };
    return {
      icon: <FileText className="h-6 w-6" />,
      bg: 'bg-muted/50',
      color: 'text-muted-foreground',
    };
  };

  const { icon, bg, color } = getIconAndColor();

  return (
    <div className="group inline-flex flex-col">
      <div
        className={cn(
          'relative flex h-15 w-15 cursor-pointer flex-col items-center justify-center rounded-lg border transition-colors hover:opacity-80',
          bg
        )}
        onClick={onDownload}
      >
        <span className={color}>{icon}</span>
        {isVideo && duration && duration > 0 && (
          <span className="text-muted-foreground mt-1 text-[10px]">
            {formatDuration(duration)}
          </span>
        )}
        {canDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            disabled={isDeleting}
            className="absolute -top-1.5 -right-1.5 hidden h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white transition-opacity group-hover:flex hover:bg-red-600 disabled:opacity-50"
          >
            <Icon name="close" size="xs" />
          </button>
        )}
      </div>
      <div className="mt-1 w-15">
        <p className="truncate text-[11px] font-medium" title={name}>
          {name}
        </p>
        <p className="text-muted-foreground text-[10px]">
          {isVideo && duration && duration > 0
            ? formatDuration(duration)
            : formatSize(size)}
        </p>
      </div>
    </div>
  );
}

function EmptyMediaState({ message }: { message: string }) {
  return (
    <div className="text-muted-foreground flex items-center justify-center py-8 text-sm">
      {message}
    </div>
  );
}

export default TicketAdditionalDetails;
