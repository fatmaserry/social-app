import { EmptyState, Skeleton, Spinner } from "@heroui/react";
import { Notification } from "iconsax-reactjs";
import { useNavigate } from "react-router";
import { useIntersectionObserver } from "@/lib/useIntersectionObserver";
import { useNotifications } from "../GetNotifications/useNotifications";
import { useMarkAsRead } from "../MarkAsRead/useMarkAsRead";
import { useMarkAllAsRead } from "../MarkAllAsRead/useMarkAllAsRead";
import NotificationItem from "../components/NotificationItem";
import type { AppNotification } from "../notifications.interface";

function Notifications() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotifications(true);
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();
  const navigate = useNavigate();

  const sentinelRef = useIntersectionObserver({
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage && !isFetchingNextPage,
  });

  const notifications = data?.pages.flatMap((page) => page.notifications) ?? [];
  const hasUnread = notifications.some((notification) => !notification.isRead);

  function handleOpen(notification: AppNotification) {
    if (!notification.isRead) markAsRead(notification._id);

    if (notification.entityType === "post" && notification.entityId) {
      navigate(`/posts/${notification.entityId}`);
    } else if (notification.entityType === "user" && notification.entityId) {
      navigate(`/profile/${notification.entityId}`);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-foreground">Notifications</h1>
        {hasUnread && (
          <button
            type="button"
            onClick={() => markAllAsRead()}
            disabled={isMarkingAll}
            className="cursor-pointer text-sm font-semibold text-main-color hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {isError && (
        <p className="rounded-3xl border border-danger/30 bg-danger-soft px-5 py-4 text-sm text-danger-soft-foreground">
          {(error as Error).message}
        </p>
      )}

      {isLoading && (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((key) => (
            <div
              key={key}
              className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4"
            >
              <Skeleton className="size-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-2.5 w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !isError && notifications.length === 0 && (
        <EmptyState className="flex flex-col items-center gap-2 rounded-3xl border border-border bg-surface py-14 text-center text-main-color">
          <Notification size="36" variant="Bold" />
          <p className="font-semibold text-foreground">No notifications yet</p>
          <p className="text-sm text-muted">
            Likes, comments, and shares on your posts will show up here.
          </p>
        </EmptyState>
      )}

      <div className="flex flex-col gap-1 rounded-3xl border border-border bg-surface p-2">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification._id}
            notification={notification}
            onOpen={handleOpen}
          />
        ))}
      </div>

      {hasNextPage && <div ref={sentinelRef} className="h-1" />}

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      )}
    </>
  );
}

export default Notifications;
