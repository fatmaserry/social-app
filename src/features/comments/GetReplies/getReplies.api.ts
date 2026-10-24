import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";
import type { CommentsPage } from "../comments.interface";
import { toComment } from "../comments.mappers";
import type { RepliesResponseType } from "./getReplies.interface";

export async function getReplies({
  postId,
  commentId,
  page,
  limit = 10,
}: {
  postId: string;
  commentId: string;
  page: number;
  limit?: number;
}): Promise<CommentsPage> {
  try {
    const res = await http.get<RepliesResponseType>(
      `/posts/${postId}/comments/${commentId}/replies`,
      { params: { page, limit } },
    );

    return {
      comments: res.data.data.replies.map(toComment),
      nextPage: res.data.meta.pagination.nextPage ?? null,
    };
  } catch (err) {
    handleApiError(err);
  }
}
