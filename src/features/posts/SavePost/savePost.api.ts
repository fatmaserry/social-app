import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";

export async function savePost(postId: string): Promise<void> {
  try {
    await http.put(`/posts/${postId}/bookmark`);
  } catch (err) {
    handleApiError(err);
  }
}
