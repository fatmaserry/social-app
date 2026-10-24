import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { markAllAsRead } from "./markAllAsRead.api";
import { notificationsKeys } from "../GetNotifications/getNotifications.keys";
import type { NotificationsPage } from "../notifications.interface";

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationsKeys.list });
      const previousList = queryClient.getQueryData<InfiniteData<NotificationsPage>>(
        notificationsKeys.list,
      );
      const previousCount = queryClient.getQueryData<number>(notificationsKeys.unreadCount);

      queryClient.setQueryData<InfiniteData<NotificationsPage>>(
        notificationsKeys.list,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              notifications: page.notifications.map((notification) => ({
                ...notification,
                isRead: true,
              })),
            })),
          };
        },
      );

      queryClient.setQueryData<number>(notificationsKeys.unreadCount, 0);

      return { previousList, previousCount };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(notificationsKeys.list, context.previousList);
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(notificationsKeys.unreadCount, context.previousCount);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKeys.list });
      queryClient.invalidateQueries({ queryKey: notificationsKeys.unreadCount });
    },
  });
}
