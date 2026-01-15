import type { FormEvent } from 'react';
import type { Ticket } from '../ticket/Ticket';

// Callback type definitions
export type OnLogout = () => void;
export type OnBack = () => void;
export type OnViewTicket = (ticket: Ticket) => void;
export type OnFilterChange = (field: string, value: string) => void;
export type OnStatusUpdate = (
  ticketId: string,
  status: string
) => Promise<void>;
export type OnPriorityUpdate = (
  ticketId: string,
  priority: string
) => Promise<void>;
export type OnAssignTicket = (
  ticketId: string,
  developerId: string
) => Promise<void>;
export type OnCommentChange = (value: string) => void;
export type OnAddComment = (e: FormEvent<HTMLFormElement>) => void;
export type OnDownloadAttachment = (
  ticketId: string,
  index: number,
  filename: string
) => Promise<void>;
export type OnDownloadScreenRecording = (
  ticketId: string,
  filename: string
) => void;
