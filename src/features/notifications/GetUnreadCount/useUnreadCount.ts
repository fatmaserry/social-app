import { useQuery } from "@tanstack/react-query";
import { getUnreadCount } from "./getUnreadCount.api";
import { notificationsKeys } from "../GetNotifications/getNotifications.keys";

export function useUnreadCount() {
  return useQuery({
    queryKey: notificationsKeys.unreadCount,
    queryFn: getUnreadCount,
    refetchInterval: 30_000,
  });
}
