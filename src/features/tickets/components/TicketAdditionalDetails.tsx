import { useState, type ReactNode } from 'react';
import { asTicketId, type Ticket, TicketCategory } from '@/types';
import {
  Icon,
  Button,
  Modal,
  Card,
  CardContent,
  Separator,
} from '@/shared/components/ui';
import { FileItem } from '@/shared/components/composite';
import { fileAPI } from '../api/file-api';
import { useTicketFileUpload } from '../hooks/useTicketFileUpload';
import FileUpload from '@/shared/components/common/FileUpload';
import ScreenRecorder from '@/shared/components/common/ScreenRecorder';
import {
  ListOrdered,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  MonitorPlay,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TicketAdditionalDetailsProps {
  ticket: Ticket;
  canUploadFiles: boolean;
}

function TicketAdditionalDetails({
  ticket,
  canUploadFiles,
}: TicketAdditionalDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const fileUpload = useTicketFileUpload({ ticketId: ticket.ticketId || '' });

  const isBug = ticket.category === TicketCategory.BUG;

  return (
    <div className="border-b p-6">
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Description</h3>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm transition-colors"
          >
            <span>Additional Details</span>
            <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} size="sm" />
          </button>
        </div>

        {ticket.description ? (
          <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">
            {ticket.description}
          </p>
        ) : (
          <p className="text-muted-foreground mt-2 text-sm">No description</p>
        )}

        {ticket.affectedModule && (
          <p className="text-muted-foreground mt-3 text-sm">
            <span className="font-medium">Affected Module:</span>{' '}
            {ticket.affectedModule}
          </p>
        )}

        {isExpanded && (
          <div className="border-border mt-6 space-y-5 border-t pt-5">
            {isBug && (
              <div className="space-y-3">
                <BugDetailCard
                  icon={<ListOrdered className="h-4 w-4" />}
                  label="Steps to Reproduce"
                  value={ticket.reproductionSteps}
                />
                <BugDetailCard
                  icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
                  label="Expected Result"
                  value={ticket.expectedResult}
                  accentClass="border-l-4 border-l-green-400"
                />
                <BugDetailCard
                  icon={<AlertCircle className="h-4 w-4 text-red-500" />}
                  label="Actual Result"
                  value={ticket.actualResult}
                  accentClass="border-l-4 border-l-red-400"
                />
              </div>
            )}

            {isBug && <Separator className="my-2" />}

            {/* Attachments & Screen Recording */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Attachments */}
              <div className="bg-muted/30 rounded-lg border p-4">
                <SectionHeader
                  icon={<Paperclip className="h-4 w-4" />}
                  label="Attachments"
                  action={
                    canUploadFiles ? (
                      <button
                        type="button"
                        onClick={fileUpload.openFileUploadModal}
                        disabled={fileUpload.isUploadingFiles}
                        className="text-primary hover:text-primary/80 flex items-center gap-1 text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        <Icon name="plus" size="xs" />
                        Add Files
                      </button>
                    ) : undefined
                  }
                />
                {ticket.attachments && ticket.attachments.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {ticket.attachments.map((attachment, index) => (
                      <FileItem
                        key={index}
                        name={
                          attachment.filename ||
                          attachment.originalName ||
                          'File'
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
                        onDelete={() =>
                          fileUpload.handleDeleteAttachment(index)
                        }
                        canDelete={canUploadFiles}
                        isDeleting={fileUpload.isDeletingAttachment}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground mt-3 text-sm">
                    No attachments added
                  </p>
                )}
              </div>

              {/* Screen Recording */}
              <div className="bg-muted/30 rounded-lg border p-4">
                <SectionHeader
                  icon={<MonitorPlay className="h-4 w-4" />}
                  label="Screen Recording"
                  action={
                    canUploadFiles ? (
                      <button
                        type="button"
                        onClick={fileUpload.openScreenRecordingModal}
                        disabled={fileUpload.isUploadingScreenRecording}
                        className="text-primary hover:text-primary/80 flex items-center gap-1 text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        {!ticket.screenRecording?.gcsUrl && (
                          <Icon name="plus" size="xs" />
                        )}
                        {ticket.screenRecording?.gcsUrl
                          ? 'Replace'
                          : 'Add Recording'}
                      </button>
                    ) : undefined
                  }
                />
                {ticket.screenRecording?.gcsUrl ? (
                  <div className="mt-3">
                    <FileItem
                      name={
                        ticket.screenRecording.originalName ||
                        'Screen Recording'
                      }
                      duration={ticket.screenRecording.duration ?? undefined}
                      isVideo
                      onDownload={() =>
                        fileAPI.downloadScreenRecording(
                          asTicketId(ticket.ticketId || ''),
                          ticket.screenRecording?.originalName ||
                            'screen-recording'
                        )
                      }
                      onDelete={fileUpload.handleDeleteScreenRecording}
                      canDelete={canUploadFiles}
                      isDeleting={fileUpload.isDeletingScreenRecording}
                    />
                  </div>
                ) : (
                  <p className="text-muted-foreground mt-3 text-sm">
                    No recording added
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* File Upload Modal */}
      <Modal
        isOpen={fileUpload.isFileUploadModalOpen}
        onClose={fileUpload.closeFileUploadModal}
        title="Upload Files"
        size="md"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={fileUpload.closeFileUploadModal}>
              Cancel
            </Button>
            <Button
              onClick={fileUpload.handleUploadFiles}
              disabled={
                fileUpload.pendingFiles.length === 0 ||
                fileUpload.isUploadingFiles
              }
            >
              {fileUpload.isUploadingFiles ? 'Uploading...' : 'Upload'}
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
        title="Record Screen"
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

function SectionHeader({
  icon,
  label,
  action,
}: {
  icon: ReactNode;
  label: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground flex items-center">{icon}</span>
        <h4 className="text-sm font-medium">{label}</h4>
      </div>
      {action}
    </div>
  );
}

function BugDetailCard({
  icon,
  label,
  value,
  accentClass,
}: {
  icon: ReactNode;
  label: string;
  value?: string | null;
  accentClass?: string;
}) {
  return (
    <Card className={cn('shadow-none', accentClass)}>
      <CardContent className="p-4">
        <SectionHeader icon={icon} label={label} />
        <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">
          {value || '-'}
        </p>
      </CardContent>
    </Card>
  );
}

export default TicketAdditionalDetails;
