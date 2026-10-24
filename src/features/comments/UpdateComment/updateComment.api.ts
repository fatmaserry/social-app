import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";

export async function updateComment({
  postId,
  commentId,
  content,
  image,
}: {
  postId: string;
  commentId: string;
  content: string;
  image?: File | null;
}): Promise<void> {
  const formData = new FormData();
  formData.append("content", content);
  if (image) {
    formData.append("image", image);
  }

  try {
    await http.put(`/posts/${postId}/comments/${commentId}`, formData);
  } catch (err) {
    handleApiError(err);
  }
}
