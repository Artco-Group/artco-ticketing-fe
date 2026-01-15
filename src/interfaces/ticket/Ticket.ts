import { TicketStatus, TicketPriority, TicketCategory } from '../common/enums';
import type { AssignedTo } from '../user/AssignedTo';
import type { Attachment } from './Attachment';
import type { ScreenRecording } from './ScreenRecording';

export interface Ticket {
  _id?: string;
  id?: string;
  ticketId?: string;
  title: string;
  description?: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  clientEmail?: string;
  affectedModule?: string;
  reproductionSteps?: string;
  expectedResult?: string;
  actualResult?: string;
  attachments?: Attachment[];
  screenRecording?: ScreenRecording;
  assignedTo?: AssignedTo | string | null;
  createdAt?: string;
  lastUpdated?: string;
}
