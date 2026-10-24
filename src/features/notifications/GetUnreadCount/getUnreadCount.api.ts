import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";

interface UnreadCountResponseType {
  success: boolean;
  message: string;
  data: {
    unreadCount: number;
  };
}

export async function getUnreadCount(): Promise<number> {
  try {
    const res = await http.get<UnreadCountResponseType>(
      "/notifications/unread-count",
    );

    return res.data.data.unreadCount ?? 0;
  } catch (err) {
    handleApiError(err);
  }
}
