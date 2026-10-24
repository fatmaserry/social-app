import type { AppNotification } from "./notifications.interface";

const messageByType: Record<string, (actorName: string) => string> = {
  like_post: (actor) => `${actor} liked your post`,
  comment_post: (actor) => `${actor} commented on your post`,
  share_post: (actor) => `${actor} shared your post`,
  follow_user: (actor) => `${actor} started following you`,
  like_comment: (actor) => `${actor} liked your comment`,
  reply_comment: (actor) => `${actor} replied to your comment`,
};

export function getNotificationMessage(notification: AppNotification): string {
  const build = messageByType[notification.type];
  return build
    ? build(notification.actor.name)
    : `${notification.actor.name} sent you a notification`;
}
