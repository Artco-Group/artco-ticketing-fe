import type {
  Activity,
  ActivityAction,
} from '@artco-group/artco-ticketing-sync';
import type { IconName } from '@/shared/components/ui/Icon';
import type { ActivityColorVariant } from './activity-constants';

export interface ActivityItem {
  id: string;
  actorId: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  actionTemplate?: string;
  affectedUserId?: string;
  affectedUserName?: string;
  targetName?: string;
  targetLink?: string;
  targetSuffix?: string;
  timestamp: Date | string;
  activityAction?: ActivityAction;
  icon?: IconName;
  metadata?: Record<string, string | undefined>;
  colorVariant?: ActivityColorVariant;
}

export interface ActivityFeedProps {
  items?: ActivityItem[];
  activities?: Activity[];
  className?: string;
  emptyMessage?: string;
  maxItems?: number;
  showIcon?: boolean;
  currentUserId?: string;
  variant?: 'list' | 'timeline';
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  hasMore?: boolean;
}
