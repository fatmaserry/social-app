import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";

export async function markAsRead(notificationId: string): Promise<void> {
  try {
    await http.patch(`/notifications/${notificationId}/read`);
  } catch (err) {
    handleApiError(err);
  }
}
