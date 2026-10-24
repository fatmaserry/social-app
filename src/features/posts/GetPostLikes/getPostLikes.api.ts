import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";
import type {
  PostLikesPage,
  PostLikesResponseType,
} from "./getPostLikes.interface";

export async function getPostLikes({
  postId,
  page,
  limit = 20,
}: {
  postId: string;
  page: number;
  limit?: number;
}): Promise<PostLikesPage> {
  try {
    const res = await http.get<PostLikesResponseType>(
      `/posts/${postId}/likes`,
      {
        params: { page, limit },
      },
    );

    return {
      likers: res.data.data.likes,
      nextPage: res.data.meta.pagination.nextPage ?? null,
    };
  } catch (err) {
    handleApiError(err);
  }
}
