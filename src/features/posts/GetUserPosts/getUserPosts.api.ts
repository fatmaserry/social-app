import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";
import type { PostsPage } from "../posts.interface";
import type { UserPostsResponseType } from "./getUserPosts.interface";

export async function getUserPosts({
  userId,
  page,
  limit = 10,
}: {
  userId: string;
  page: number;
  limit?: number;
}): Promise<PostsPage> {
  try {
    const res = await http.get<UserPostsResponseType>(`/users/${userId}/posts`, {
      params: { page, limit },
    });

    return {
      posts: res.data.data.posts,
      nextPage: res.data.meta.pagination.nextPage ?? null,
    };
  } catch (err) {
    handleApiError(err);
  }
}
