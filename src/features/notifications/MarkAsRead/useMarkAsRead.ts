import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { markAsRead } from "./markAsRead.api";
import { notificationsKeys } from "../GetNotifications/getNotifications.keys";
import type { NotificationsPage } from "../notifications.interface";

function markRead(
  page: NotificationsPage,
  notificationId: string,
): NotificationsPage {
  return {
    ...page,
    notifications: page.notifications.map((notification) =>
      notification._id === notificationId
        ? { ...notification, isRead: true }
        : notification,
    ),
  };
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => markAsRead(notificationId),
    onMutate: async (notificationId: string) => {
      await queryClient.cancelQueries({ queryKey: notificationsKeys.list });
      const previousList = queryClient.getQueryData<
        InfiniteData<NotificationsPage>
      >(notificationsKeys.list);
      const previousCount = queryClient.getQueryData<number>(
        notificationsKeys.unreadCount,
      );

      queryClient.setQueryData<InfiniteData<NotificationsPage>>(
        notificationsKeys.list,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => markRead(page, notificationId)),
          };
        },
      );

      queryClient.setQueryData<number>(notificationsKeys.unreadCount, (old) =>
        Math.max(0, (old ?? 1) - 1),
      );

      return { previousList, previousCount };
    },
    onError: (_err, _notificationId, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(notificationsKeys.list, context.previousList);
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(
          notificationsKeys.unreadCount,
          context.previousCount,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.list });
      queryClient.invalidateQueries({
        queryKey: notificationsKeys.unreadCount,
      });
    },
  });
}
