import { Avatar } from "@heroui/react";
import { getInitials } from "@/lib/getInitials";
import { timeAgo } from "@/lib/timeAgo";
import { getNotificationMessage } from "../notifications.messages";
import NotificationEntityPreview from "./NotificationEntityPreview";
import type { AppNotification } from "../notifications.interface";

function NotificationItem({
  notification,
  onOpen,
}: {
  notification: AppNotification;
  onOpen: (notification: AppNotification) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(notification)}
      className={`flex w-full cursor-pointer items-start gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-surface-secondary ${
        notification.isRead ? "" : "bg-main-color/5"
      }`}
    >
      <Avatar size="sm">
        <Avatar.Image alt={notification.actor.name} src={notification.actor.photo} />
        <Avatar.Fallback>{getInitials(notification.actor.name)}</Avatar.Fallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-foreground">{getNotificationMessage(notification)}</p>
        <p className="mt-0.5 text-xs text-muted">{timeAgo(notification.createdAt)} ago</p>
        <NotificationEntityPreview notification={notification} />
      </div>

      {!notification.isRead && (
        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-main-color" />
      )}
    </button>
  );
}

export default NotificationItem;
