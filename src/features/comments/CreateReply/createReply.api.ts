import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";
import type { Comment } from "../comments.interface";
import type { CreateReplyResponseType } from "./createReply.interface";

export async function createReply({
  postId,
  commentId,
  content,
  image,
}: {
  postId: string;
  commentId: string;
  content: string;
  image?: File | null;
}): Promise<Comment> {
  const formData = new FormData();
  formData.append("content", content);
  if (image) {
    formData.append("image", image);
  }

  try {
    const res = await http.post<CreateReplyResponseType>(
      `/posts/${postId}/comments/${commentId}/replies`,
      formData,
    );

    return res.data.data.reply;
  } catch (err) {
    handleApiError(err);
  }
}
