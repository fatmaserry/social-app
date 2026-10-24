import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";

export async function deletePost(postId: string): Promise<void> {
  try {
    await http.delete(`/posts/${postId}`);
  } catch (err) {
    handleApiError(err);
  }
}
