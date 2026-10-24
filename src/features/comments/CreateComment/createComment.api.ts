import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";
import type { Comment } from "../comments.interface";
import type { CreateCommentResponseType } from "./createComment.interface";

export async function createComment({
  postId,
  content,
  image,
}: {
  postId: string;
  content: string;
  image?: File | null;
}): Promise<Comment> {
  const formData = new FormData();
  formData.append("content", content);
  if (image) {
    formData.append("image", image);
  }

  try {
    const res = await http.post<CreateCommentResponseType>(
      `/posts/${postId}/comments`,
      formData,
    );

    return res.data.data.comment;
  } catch (err) {
    handleApiError(err);
  }
}
