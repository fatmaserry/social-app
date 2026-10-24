import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";
import type { FeedScope, PostsPage } from "../posts.interface";
import type { PostsResponseType } from "./getPostsFeed.interface";

export async function getPostsFeed({
  scope,
  page,
  limit = 10,
}: {
  scope: FeedScope;
  page: number;
  limit?: number;
}): Promise<PostsPage> {
  const path = scope === "following" ? "/posts/feed" : "/posts";
  const params = scope === "following" ? { only: "following", page, limit } : { page, limit };

  try {
    const res = await http.get<PostsResponseType>(path, { params });

    return {
      posts: res.data.data.posts,
      nextPage: res.data.meta.pagination.nextPage ?? null,
    };
  } catch (err) {
    handleApiError(err);
  }
}
