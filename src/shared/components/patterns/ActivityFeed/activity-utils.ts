import {
  ActivityAction,
  ActivityActionLabels,
  type Activity,
} from '@artco-group/artco-ticketing-sync';
import type { ActivityItem } from './ActivityFeed';

function getTargetLink(activity: Activity): string | undefined {
  const { type, identifier } = activity.target;
  switch (type) {
    case 'ticket':
      return `/tickets/${identifier}`;
    case 'project':
      return identifier ? `/projects/${identifier}` : undefined;
    default:
      return undefined;
  }
}

export function transformActivity(activity: Activity): ActivityItem {
  const actionLabel = ActivityActionLabels[activity.action] || activity.action;

  const targetName = activity.target.title;

  let action = actionLabel;
  let actionTemplate: string | undefined;
  let targetSuffix: string | undefined;

  if (activity.metadata?.oldValue && activity.metadata?.newValue) {
    targetSuffix = `from ${activity.metadata.oldValue} to ${activity.metadata.newValue}`;
  }

  // Store template for affected user actions (will be filled in during render)
  if (activity.metadata?.affectedUserName) {
    const preposition =
      activity.action === ActivityAction.PROJECT_MEMBER_REMOVED ? 'from' : 'to';
    actionTemplate = `${actionLabel} {affectedUser} ${preposition}`;
    action = `${actionLabel} ${activity.metadata.affectedUserName} ${preposition}`;
  }

  return {
    id: activity.id,
    actorId: activity.actor.id,
    user: {
      name: activity.actor.name,
      avatar: activity.actor.profilePic,
    },
    action,
    actionTemplate,
    affectedUserId: activity.metadata?.affectedUserId,
    affectedUserName: activity.metadata?.affectedUserName,
    targetName,
    targetLink: getTargetLink(activity),
    targetSuffix,
    timestamp: activity.createdAt,
    activityAction: activity.action,
  };
}
