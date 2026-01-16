import type { ReactNode, FormEvent } from 'react';

// Enums
export enum TicketStatus {
  New = 'New',
  Open = 'Open',
  InProgress = 'In Progress',
  Resolved = 'Resolved',
  Closed = 'Closed',
}

export enum TicketPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical',
}

export enum TicketCategory {
  Bug = 'Bug',
  FeatureRequest = 'Feature Request',
  Question = 'Question',
  Other = 'Other',
}

export enum UserRole {
  Client = 'client',
  Developer = 'developer',
  EngLead = 'eng_lead',
  Admin = 'admin',
}

// User types
export interface User {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: UserRole;
  createdAt?: string;
}

export interface Author {
  _id: string;
  name: string;
  email?: string;
}

export interface AssignedTo {
  _id: string;
  name?: string;
  email?: string;
}

// Ticket types
export interface Attachment {
  filename?: string;
  originalName?: string;
  mimetype?: string;
  size?: number;
}

export interface ScreenRecording {
  originalName?: string;
  size?: number;
  duration?: number;
}

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

export interface Comment {
  _id: string;
  text: string;
  authorId: Author;
  updatedAt: string;
  createdAt?: string;
}

// Common types
export interface Filters {
  status: string;
  priority: string;
  sortBy: string;
  client?: string;
  assignee?: string;
}

export interface TicketFormData {
  title: string;
  category: string;
  affectedModule: string;
  description: string;
  reproductionSteps: string;
  expectedResult: string;
  actualResult: string;
  priority: string;
}

export interface MetaItem {
  label: string;
  value: ReactNode;
}

// Callback types
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
