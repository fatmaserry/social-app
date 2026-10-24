import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";
import type { CommentsPage } from "../comments.interface";
import { toComment } from "../comments.mappers";
import type { CommentsResponseType } from "./getComments.interface";

export async function getComments({
  postId,
  page,
  limit = 10,
}: {
  postId: string;
  page: number;
  limit?: number;
}): Promise<CommentsPage> {
  try {
    const res = await http.get<CommentsResponseType>(`/posts/${postId}/comments`, {
      params: { page, limit },
    });

    return {
      comments: res.data.data.comments.map(toComment),
      nextPage: res.data.meta.pagination.nextPage ?? null,
    };
  } catch (err) {
    handleApiError(err);
  }
}
