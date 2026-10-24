import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";

export async function likePost(postId: string): Promise<void> {
  try {
    await http.put(`/posts/${postId}/like`);
  } catch (err) {
    handleApiError(err);
  }
}
