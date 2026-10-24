import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";

export async function markAllAsRead(): Promise<void> {
  try {
    await http.patch("/notifications/read-all");
  } catch (err) {
    handleApiError(err);
  }
}
