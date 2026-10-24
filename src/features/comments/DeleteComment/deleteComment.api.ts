import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";

export async function deleteComment({
  postId,
  commentId,
}: {
  postId: string;
  commentId: string;
}): Promise<void> {
  try {
    await http.delete(`/posts/${postId}/comments/${commentId}`);
  } catch (err) {
    handleApiError(err);
  }
}
