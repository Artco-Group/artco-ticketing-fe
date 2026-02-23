import {
  ActivityAction,
  formatDateDisplay,
  StatusIdTranslationKeys,
  ActivityActionTranslationKeys,
} from '@artco-group/artco-ticketing-sync';
import { useAppTranslation } from '@/shared/hooks';
import { priorityTranslationKeyMap } from './activity-constants';
import type { ActivityItem } from './types';

export function useActivityTranslations() {
  const { translate, language } = useAppTranslation('common');
  const { translate: translateTickets } = useAppTranslation('tickets');

  const formatRelativeTime = (date: Date | string): string => {
    const now = new Date();
    const timestamp = typeof date === 'string' ? new Date(date) : date;
    const diffMs = now.getTime() - timestamp.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return translate('time.justNow');
    if (diffMins < 60) return translate('time.minutesAgo', { count: diffMins });
    if (diffHours < 24) return translate('time.hoursAgo', { count: diffHours });
    if (diffDays < 7) return translate('time.daysAgo', { count: diffDays });

    return formatDateDisplay(timestamp, language, 'short');
  };

  const translateValue = (value: string): string => {
    const statusKey = StatusIdTranslationKeys[value];
    if (statusKey) return translateTickets(statusKey);
    const priorityKey = priorityTranslationKeyMap[value];
    if (priorityKey) return translateTickets(priorityKey);
    return value;
  };

  const getTranslatedAction = (
    item: ActivityItem,
    isCurrentUser: boolean
  ): string => {
    if (item.activityAction) {
      const translationKey = ActivityActionTranslationKeys[item.activityAction];
      if (translationKey) {
        const actionKey = isCurrentUser
          ? translationKey.replace('activity.actions.', 'activity.youActions.')
          : translationKey;
        const baseAction = translate(actionKey);
        if (item.affectedUserName) {
          let preposition: string;
          if (item.activityAction === ActivityAction.PROJECT_MEMBER_REMOVED) {
            preposition = translate('activity.prepositions.from');
          } else if (item.activityAction === ActivityAction.TICKET_ASSIGNED) {
            preposition = translate('activity.prepositions.toTicket');
          } else {
            preposition = translate('activity.prepositions.to');
          }
          return `${baseAction} ${item.affectedUserName} ${preposition}`;
        }
        return baseAction;
      }
    }
    return item.action;
  };

  const getTranslatedSuffix = (item: ActivityItem): string | undefined => {
    if (item.metadata?.oldValue && item.metadata?.newValue) {
      const fromValue =
        item.metadata.oldStatusName || translateValue(item.metadata.oldValue);
      const toValue =
        item.metadata.newStatusName || translateValue(item.metadata.newValue);
      return translate('activity.fromTo', {
        from: fromValue,
        to: toValue,
      });
    }
    return item.targetSuffix;
  };

  return {
    formatRelativeTime,
    youLabel: translate('activity.you'),
    youLowercase: translate('activity.youLowercase'),
    auxiliaryThirdPerson: translate('activity.auxiliary.thirdPerson'),
    auxiliarySecondPerson: translate('activity.auxiliary.secondPerson'),
    noActivityMessage: translate('activity.noActivity'),
    moreActivitiesLabel: (count: number) =>
      translate('activity.moreActivities', { count }),
    loadMoreLabel: translate('activity.loadMore'),
    loadingLabel: translate('buttons.loading'),
    getTranslatedAction,
    getTranslatedSuffix,
  };
}

export type ActivityTranslations = ReturnType<typeof useActivityTranslations>;
