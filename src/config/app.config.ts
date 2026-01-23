/**
 * Application Configuration Constants
 * Centralized configuration for UI behavior, limits, and options
 */

// ============================================
// UI Timing Constants
// ============================================
export const UI_TIMEOUTS = {
  /** Duration to show success messages (ms) */
  SUCCESS_MESSAGE_DURATION: 3000,
  /** Toast notification duration (ms) */
  TOAST_DURATION: 3000,
  /** Redirect delay after success (ms) */
  REDIRECT_DELAY: 2000,
} as const;

// ============================================
// Screen Recording Configuration
// ============================================
export const SCREEN_RECORDING = {
  /** Maximum recording duration in seconds */
  MAX_DURATION_SECONDS: 180,
  /** Video bitrate in bits per second */
  BITRATE: 1_000_000,
  /** Estimated max file size in MB */
  ESTIMATED_MAX_SIZE_MB: 22,
} as const;

// ============================================
// Filter Options
// ============================================
export const FILTER_OPTIONS = {
  STATUS: {
    ALL: [
      { value: 'All', label: 'All Status' },
      { value: 'New', label: 'New' },
      { value: 'Open', label: 'Open' },
      { value: 'In Progress', label: 'In Progress' },
      { value: 'Resolved', label: 'Resolved' },
      { value: 'Closed', label: 'Closed' },
    ],
    DEVELOPER: [
      { value: 'All', label: 'All Status' },
      { value: 'New', label: 'New' },
      { value: 'In Progress', label: 'In Progress' },
      { value: 'Resolved', label: 'Resolved' },
    ],
  },
  PRIORITY: [
    { value: 'All', label: 'All Priority' },
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Critical', label: 'Critical' },
  ],
  SORT_BY: {
    ENG_LEAD: [
      { value: 'Status', label: 'Status' },
      { value: 'Created Date', label: 'Created Date' },
      { value: 'Priority', label: 'Priority' },
      { value: 'Client', label: 'Client' },
      { value: 'Assignee', label: 'Assignee' },
    ],
    DEVELOPER: [
      { value: 'Created Date', label: 'Created Date' },
      { value: 'Priority', label: 'Priority' },
      { value: 'Status', label: 'Status' },
    ],
  },
} as const;

// Type exports for type safety
export type FilterOption = { value: string; label: string };
export type StatusFilterOptions = typeof FILTER_OPTIONS.STATUS;
export type PriorityFilterOptions = typeof FILTER_OPTIONS.PRIORITY;
export type SortByOptions = typeof FILTER_OPTIONS.SORT_BY;
