import { Spinner } from "@heroui/react";
import { Link, useNavigate } from "react-router";
import { useNotifications } from "../GetNotifications/useNotifications";
import { useMarkAsRead } from "../MarkAsRead/useMarkAsRead";
import { useMarkAllAsRead } from "../MarkAllAsRead/useMarkAllAsRead";
import NotificationItem from "./NotificationItem";
import type { AppNotification } from "../notifications.interface";

function NotificationsPanel({
  isOpen,
  onNavigate,
}: {
  isOpen: boolean;
  onNavigate: () => void;
}) {
  const { data, isLoading } = useNotifications(isOpen);
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();
  const navigate = useNavigate();

  const notifications = (data?.pages[0]?.notifications ?? []).slice(0, 8);
  const hasUnread = notifications.some((notification) => !notification.isRead);

  function handleOpen(notification: AppNotification) {
    if (!notification.isRead) markAsRead(notification._id);

    if (notification.entityType === "post" && notification.entityId) {
      onNavigate();
      navigate(`/posts/${notification.entityId}`);
    } else if (notification.entityType === "user" && notification.entityId) {
      onNavigate();
      navigate(`/profile/${notification.entityId}`);
    }
  }

  return (
    <div className="flex w-80 flex-col">
      <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
        <p className="text-sm font-semibold text-foreground">Notifications</p>
        {hasUnread && (
          <button
            type="button"
            onClick={() => markAllAsRead()}
            disabled={isMarkingAll}
            className="cursor-pointer text-xs font-semibold text-main-color hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="flex max-h-96 flex-col gap-0.5 overflow-y-auto p-1.5">
        {isLoading && (
          <div className="flex justify-center py-8">
            <Spinner size="sm" />
          </div>
        )}

        {!isLoading && notifications.length === 0 && (
          <p className="py-8 text-center text-sm text-muted">
            You're all caught up.
          </p>
        )}

        {notifications.map((notification) => (
          <NotificationItem
            key={notification._id}
            notification={notification}
            onOpen={handleOpen}
          />
        ))}
      </div>

      <Link
        to="/notifications"
        onClick={onNavigate}
        className="border-t border-border py-2.5 text-center text-sm font-semibold text-main-color hover:bg-surface-secondary"
      >
        See all notifications
      </Link>
    </div>
  );
}

export default NotificationsPanel;
