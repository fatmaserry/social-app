import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";

export async function likeComment({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}): Promise<void> {
  try {
    await http.put(`/posts/${postId}/comments/${commentId}/like`);
  } catch (err) {
    handleApiError(err);
  }
}
