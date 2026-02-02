import React, { type SVGProps } from 'react';
import { cn } from '@/lib/utils';

import dashboardSvg from '@/assets/icons/navigation/dashboard.svg?raw';
import ticketsSvg from '@/assets/icons/navigation/tickets.svg?raw';
import userSvg from '@/assets/icons/navigation/user.svg?raw';
import inboxSvg from '@/assets/icons/navigation/inbox.svg?raw';
import tasksSvg from '@/assets/icons/navigation/tasks.svg?raw';
import notesSvg from '@/assets/icons/navigation/notes.svg?raw';
import reportsSvg from '@/assets/icons/navigation/reports.svg?raw';
import allSvg from '@/assets/icons/navigation/all.svg?raw';

import minusSvg from '@/assets/icons/actions/minus.svg?raw';
import plusSvg from '@/assets/icons/actions/plus.svg?raw';
import searchSvg from '@/assets/icons/actions/search.svg?raw';
import trashSvg from '@/assets/icons/actions/trash.svg?raw';
import editSvg from '@/assets/icons/actions/edit.svg?raw';
import closeSvg from '@/assets/icons/actions/close.svg?raw';
import downloadSvg from '@/assets/icons/actions/download.svg?raw';
import uploadSvg from '@/assets/icons/actions/upload.svg?raw';
import lockSvg from '@/assets/icons/actions/lock.svg?raw';
import eyeSvg from '@/assets/icons/actions/eye.svg?raw';
import eyeOffSvg from '@/assets/icons/actions/eye-off.svg?raw';
import mailSvg from '@/assets/icons/actions/mail.svg?raw';
import shieldCheckSvg from '@/assets/icons/actions/shield-check.svg?raw';
import logoutSvg from '@/assets/icons/actions/logout.svg?raw';

import chevronDownSvg from '@/assets/icons/arrows/chevron-down.svg?raw';
import chevronUpSvg from '@/assets/icons/arrows/chevron-up.svg?raw';
import chevronLeftSvg from '@/assets/icons/arrows/chevron-left.svg?raw';
import chevronRightSvg from '@/assets/icons/arrows/chevron-right.svg?raw';
import arrowRightSvg from '@/assets/icons/arrows/arrow-right.svg?raw';

import backlogSvg from '@/assets/icons/status/backlog.svg?raw';
import todoSvg from '@/assets/icons/status/todo.svg?raw';
import inProgressSvg from '@/assets/icons/status/in-progress.svg?raw';
import doneSvg from '@/assets/icons/status/done.svg?raw';
import checkSvg from '@/assets/icons/status/check.svg?raw';
import checkActionSvg from '@/assets/icons/actions/check.svg?raw';
import prioritySvg from '@/assets/icons/status/priority.svg?raw';

import infoSvg from '@/assets/icons/feedback/info.svg?raw';
import checkCircleSvg from '@/assets/icons/feedback/check-circle.svg?raw';

import clockSvg from '@/assets/icons/system/clock.svg?raw';
import fileTextSvg from '@/assets/icons/system/file-text.svg?raw';
import settingsSvg from '@/assets/icons/system/settings.svg?raw';
import notificationSvg from '@/assets/icons/system/notification.svg?raw';
import doubleCheckSvg from '@/assets/icons/system/double-check.svg?raw';

import pinSvg from '@/assets/icons/navigation/pin.svg?raw';
import automationsSvg from '@/assets/icons/navigation/automations.svg?raw';
import sidebarSvg from '@/assets/icons/navigation/sidebar.svg?raw';
import chevronSelectorSvg from '@/assets/icons/arrows/chevron-selector.svg?raw';

import arrowLeftSvg from '@/assets/icons/arrows/arrow-left.svg?raw';
import trendUpSvg from '@/assets/icons/arrows/trend-up.svg?raw';
import trendDownSvg from '@/assets/icons/arrows/trend-down.svg?raw';
import commandKSvg from '@/assets/icons/system/command-k.svg?raw';

export type IconName =
  | 'dashboard'
  | 'tickets'
  | 'user'
  | 'inbox'
  | 'tasks'
  | 'notes'
  | 'reports'
  | 'all'
  | 'automations'
  | 'pin'
  | 'sidebar'
  | 'minus'
  | 'plus'
  | 'search'
  | 'trash'
  | 'edit'
  | 'close'
  | 'download'
  | 'upload'
  | 'lock'
  | 'eye'
  | 'eye-off'
  | 'mail'
  | 'shield-check'
  | 'logout'
  | 'chevron-down'
  | 'chevron-up'
  | 'chevron-left'
  | 'chevron-right'
  | 'chevron-selector'
  | 'arrow-right'
  | 'backlog'
  | 'todo'
  | 'in-progress'
  | 'done'
  | 'check'
  | 'check-simple'
  | 'priority'
  | 'info'
  | 'check-circle'
  | 'clock'
  | 'file-text'
  | 'settings'
  | 'arrow-left'
  | 'notification'
  | 'double-check'
  | 'trend-up'
  | 'trend-down'
  | 'command-k';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

const iconMap: Record<IconName, string> = {
  dashboard: dashboardSvg,
  tickets: ticketsSvg,
  user: userSvg,
  inbox: inboxSvg,
  tasks: tasksSvg,
  notes: notesSvg,
  reports: reportsSvg,
  all: allSvg,
  automations: automationsSvg,
  pin: pinSvg,
  sidebar: sidebarSvg,
  minus: minusSvg,
  plus: plusSvg,
  search: searchSvg,
  trash: trashSvg,
  edit: editSvg,
  close: closeSvg,
  download: downloadSvg,
  upload: uploadSvg,
  lock: lockSvg,
  eye: eyeSvg,
  'eye-off': eyeOffSvg,
  mail: mailSvg,
  'shield-check': shieldCheckSvg,
  logout: logoutSvg,
  'chevron-down': chevronDownSvg,
  'chevron-up': chevronUpSvg,
  'chevron-left': chevronLeftSvg,
  'chevron-right': chevronRightSvg,
  'chevron-selector': chevronSelectorSvg,
  'arrow-right': arrowRightSvg,
  backlog: backlogSvg,
  todo: todoSvg,
  'in-progress': inProgressSvg,
  done: doneSvg,
  check: checkSvg,
  'check-simple': checkActionSvg,
  priority: prioritySvg,
  info: infoSvg,
  'check-circle': checkCircleSvg,
  clock: clockSvg,
  'file-text': fileTextSvg,
  settings: settingsSvg,
  'arrow-left': arrowLeftSvg,
  notification: notificationSvg,
  'double-check': doubleCheckSvg,
  'trend-up': trendUpSvg,
  'trend-down': trendDownSvg,
  'command-k': commandKSvg,
};

const sizeMap: Record<IconSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  xxl: 'w-9 h-9',
};

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: IconSize;
  className?: string;
  'aria-label'?: string;
}

export function Icon({
  name,
  size = 'md',
  className = '',
  'aria-label': ariaLabel,
  ...props
}: IconProps) {
  const svgContent = iconMap[name];

  if (!svgContent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  const svgWithClass = svgContent.replace(
    /<svg\s/,
    `<svg class="${cn(sizeMap[size], className)}" `
  );

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center',
        sizeMap[size],
        className
      )}
      style={{ lineHeight: 0 }}
      aria-hidden={!ariaLabel}
      aria-label={ariaLabel}
      dangerouslySetInnerHTML={{ __html: svgWithClass }}
      {...(props as React.HTMLAttributes<HTMLSpanElement>)}
    />
  );
}
