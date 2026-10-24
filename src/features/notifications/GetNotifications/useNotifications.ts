import { useInfiniteQuery } from "@tanstack/react-query";
import { getNotifications } from "./getNotifications.api";
import { notificationsKeys } from "./getNotifications.keys";

export function useNotifications(enabled: boolean) {
  return useInfiniteQuery({
    queryKey: notificationsKeys.list,
    queryFn: ({ pageParam }) => getNotifications({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled,
  });
}
