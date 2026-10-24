import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";
import type { NotificationsPage } from "../notifications.interface";
import type { NotificationsResponseType } from "./getNotifications.interface";

export async function getNotifications({
  page,
  limit = 10,
}: {
  page: number;
  limit?: number;
}): Promise<NotificationsPage> {
  try {
    const res = await http.get<NotificationsResponseType>("/notifications", {
      params: { page, limit },
    });

    return {
      notifications: res.data.data.notifications,
      nextPage: res.data.meta.pagination.nextPage ?? null,
    };
  } catch (err) {
    handleApiError(err);
  }
}
