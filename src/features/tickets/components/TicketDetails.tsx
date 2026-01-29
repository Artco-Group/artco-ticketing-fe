import type { ReactNode } from 'react';
import { formatDateTime } from '@artco-group/artco-ticketing-sync';
import {
  asTicketId,
  TicketStatus,
  TicketPriority,
  TicketCategory,
  type Ticket,
  type MetaItem,
  type TicketId,
} from '@/types';
import {
  statusBadgeConfig,
  priorityBadgeConfig,
  categoryBadgeConfig,
} from '@/shared/utils/ticket-helpers';
import { Card } from '@/shared/components/ui';
import { Badge } from '@/shared/components/ui';
import TicketAttachments from './TicketAttachments';
import TicketScreenRecording from './TicketScreenRecording';

interface TicketDetailsProps {
  ticket: Ticket | null;
  showClient?: boolean;
  showAssignedTo?: boolean;
  onDownloadAttachment?: (
    ticketId: TicketId,
    index: number,
    filename: string
  ) => Promise<void>;
  onDownloadScreenRecording?: (ticketId: TicketId, filename: string) => void;
  formatDateTime?: (date: string | Date) => string;
  className?: string;
}

interface MetaItemProps {
  label: string;
  value: ReactNode;
}

interface DescriptionSectionProps {
  title: string;
  content: string;
}

function TicketDetails({
  ticket,
  showClient = false,
  showAssignedTo = false,
  onDownloadAttachment,
  onDownloadScreenRecording,
  formatDateTime: customFormatDateTime,
  className = '',
}: TicketDetailsProps) {
  if (!ticket) {
    return (
      <div
        className={`flex min-h-[50vh] items-center justify-center ${className}`}
      >
        <div className="text-center">
          <div className="border-brand-primary/20 border-t-brand-primary mx-auto h-12 w-12 animate-spin rounded-full border-4"></div>
          <p className="text-greyscale-600 mt-4">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  const formatDate = customFormatDateTime || formatDateTime;

  // Build metadata items based on props
  const metadataItems: MetaItem[] = [
    {
      label: 'Created',
      value: ticket.createdAt ? formatDate(ticket.createdAt) : '',
    },
  ];

  if (showClient) {
    metadataItems.push({
      label: 'Client',
      value: ticket.clientEmail ?? '',
    });
  }

  metadataItems.push(
    {
      label: 'Category',
      value: (
        <Badge
          variant={
            categoryBadgeConfig[ticket.category as TicketCategory].variant
          }
        >
          {categoryBadgeConfig[ticket.category as TicketCategory].label}
        </Badge>
      ),
    },
    {
      label: 'Priority',
      value: (
        <Badge
          variant={
            priorityBadgeConfig[ticket.priority as TicketPriority].variant
          }
          icon={priorityBadgeConfig[
            ticket.priority as TicketPriority
          ].getIcon?.()}
        >
          {priorityBadgeConfig[ticket.priority as TicketPriority].label}
        </Badge>
      ),
    }
  );

  if (ticket.affectedModule) {
    metadataItems.push({
      label: 'Affected Module',
      value: ticket.affectedModule,
    });
  }

  if (showAssignedTo) {
    metadataItems.push({
      label: 'Assigned To',
      value: ticket.assignedTo ? (
        typeof ticket.assignedTo === 'string' ? (
          ticket.assignedTo
        ) : (
          ticket.assignedTo.name || ticket.assignedTo.email || ''
        )
      ) : (
        <span className="font-medium text-orange-600">Unassigned</span>
      ),
    });
  }

  return (
    <Card className={`p-8 ${className}`}>
      {/* Title & Status */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <h1 className="text-greyscale-900 text-2xl font-bold">
          {ticket.title}
        </h1>
        <Badge
          variant={statusBadgeConfig[ticket.status as TicketStatus].variant}
          icon={statusBadgeConfig[ticket.status as TicketStatus].getIcon?.()}
          size="lg"
        >
          {statusBadgeConfig[ticket.status as TicketStatus].label}
        </Badge>
      </div>

      {/* Ticket ID */}
      <p className="text-greyscale-400 mb-6 text-sm">
        #{ticket.ticketId || ticket.id}
      </p>

      {/* Meta Info Grid */}
      <div className="mb-8 grid grid-cols-2 gap-6 border-b border-gray-100 pb-8 md:grid-cols-4">
        {metadataItems.map((item, index) => (
          <MetaItemComponent
            key={index}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>

      {/* Description Sections */}
      {ticket.description && (
        <DescriptionSection title="Description" content={ticket.description} />
      )}
      {ticket.reproductionSteps && (
        <DescriptionSection
          title="Reproduction Steps"
          content={ticket.reproductionSteps}
        />
      )}
      {ticket.expectedResult && (
        <DescriptionSection
          title="Expected Result"
          content={ticket.expectedResult}
        />
      )}
      {ticket.actualResult && (
        <DescriptionSection
          title="Actual Result"
          content={ticket.actualResult}
        />
      )}

      {/* Attachments */}
      {ticket.attachments && ticket.attachments.length > 0 && ticket._id && (
        <TicketAttachments
          attachments={ticket.attachments}
          ticketId={asTicketId(ticket._id)}
          onDownload={onDownloadAttachment}
        />
      )}

      {/* Screen Recording */}
      {ticket.screenRecording && ticket._id && (
        <TicketScreenRecording
          screenRecording={ticket.screenRecording}
          ticketId={asTicketId(ticket._id)}
          onDownload={onDownloadScreenRecording}
        />
      )}
    </Card>
  );
}

function MetaItemComponent({ label, value }: MetaItemProps) {
  return (
    <div>
      <span className="text-greyscale-400 text-xs tracking-wide uppercase">
        {label}
      </span>
      <p className="text-greyscale-900 mt-1 text-sm">{value}</p>
    </div>
  );
}

function DescriptionSection({ title, content }: DescriptionSectionProps) {
  if (!content) return null;

  return (
    <div className="mb-6">
      <h3 className="text-greyscale-700 mb-3 text-sm font-semibold">{title}</h3>
      <p className="text-greyscale-600 text-sm leading-relaxed whitespace-pre-wrap">
        {content}
      </p>
    </div>
  );
}

export default TicketDetails;
