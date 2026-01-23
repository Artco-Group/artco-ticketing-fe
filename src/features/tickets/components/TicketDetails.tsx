import type { ReactNode } from 'react';
import { type Ticket, formatDateTime } from '@artco-group/artco-ticketing-sync';
import type { MetaItem } from '@/types';
import {
  statusColors,
  priorityConfig,
  categoryColors,
} from '@/shared/utils/ticket-helpers';
import TicketAttachments from './TicketAttachments';
import TicketScreenRecording from './TicketScreenRecording';

interface TicketDetailsProps {
  ticket: Ticket | null;
  showClient?: boolean;
  showAssignedTo?: boolean;
  onDownloadAttachment?: (
    ticketId: string,
    index: number,
    filename: string
  ) => Promise<void>;
  onDownloadScreenRecording?: (ticketId: string, filename: string) => void;
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
          <p className="mt-4 text-gray-600">Loading ticket details...</p>
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
        <span
          className={`inline-block rounded-full border px-2.5 py-1 text-xs font-medium ${categoryColors[ticket.category]}`}
        >
          {ticket.category}
        </span>
      ),
    },
    {
      label: 'Priority',
      value: (
        <span
          className={`inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium ${priorityConfig[ticket.priority].bg} ${priorityConfig[ticket.priority].color}`}
        >
          {priorityConfig[ticket.priority].label}
        </span>
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
    <div
      className={`rounded-xl border border-gray-200 bg-white p-8 ${className}`}
    >
      {/* Title & Status */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
        <span
          className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium ${statusColors[ticket.status]}`}
        >
          {ticket.status}
        </span>
      </div>

      {/* Ticket ID */}
      <p className="mb-6 text-sm text-gray-400">
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
          ticketId={ticket._id}
          onDownload={onDownloadAttachment}
        />
      )}

      {/* Screen Recording */}
      {ticket.screenRecording && ticket._id && (
        <TicketScreenRecording
          screenRecording={ticket.screenRecording}
          ticketId={ticket._id}
          onDownload={onDownloadScreenRecording}
        />
      )}
    </div>
  );
}

function MetaItemComponent({ label, value }: MetaItemProps) {
  return (
    <div>
      <span className="text-xs tracking-wide text-gray-400 uppercase">
        {label}
      </span>
      <p className="mt-1 text-sm text-gray-900">{value}</p>
    </div>
  );
}

function DescriptionSection({ title, content }: DescriptionSectionProps) {
  if (!content) return null;

  return (
    <div className="mb-6">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">{title}</h3>
      <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-600">
        {content}
      </p>
    </div>
  );
}

export default TicketDetails;
