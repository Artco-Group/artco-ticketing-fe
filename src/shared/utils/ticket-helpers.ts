import type { TicketStatus, TicketPriority, TicketCategory } from '@/types';

// Status badge colors
export const statusColors: Record<TicketStatus, string> = {
  New: 'bg-blue-100 text-blue-700 border-blue-200',
  Open: 'bg-orange-100 text-orange-700 border-orange-200',
  'In Progress': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Resolved: 'bg-green-100 text-green-700 border-green-200',
  Closed: 'bg-gray-100 text-gray-600 border-gray-200',
};

// Priority colors and icons
interface PriorityConfigValue {
  color: string;
  bg: string;
  label: string;
}

export const priorityConfig: Record<TicketPriority, PriorityConfigValue> = {
  Low: { color: 'text-green-600', bg: 'bg-green-50', label: 'Nizak' },
  Medium: { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Srednji' },
  High: { color: 'text-orange-600', bg: 'bg-orange-50', label: 'Visok' },
  Critical: { color: 'text-red-600', bg: 'bg-red-50', label: 'Kritičan' },
};

// Category tags
export const categoryColors: Record<TicketCategory, string> = {
  Bug: 'bg-red-50 text-red-600 border-red-200',
  'Feature Request': 'bg-purple-50 text-purple-600 border-purple-200',
  Question: 'bg-blue-50 text-blue-600 border-blue-200',
  Other: 'bg-gray-50 text-gray-600 border-gray-200',
};

// Initial form data for new ticket
export const initialFormData = {
  title: '',
  category: '',
  affectedModule: '',
  description: '',
  reproductionSteps: '',
  expectedResult: '',
  actualResult: '',
  priority: 'Low',
  attachments: [] as File[],
};
