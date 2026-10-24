import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";
import type { PostsPage } from "../posts.interface";
import type { BookmarksResponseType } from "./getBookmarks.interface";

export async function getBookmarkedPosts({
  page,
  limit = 10,
}: {
  page: number;
  limit?: number;
}): Promise<PostsPage> {
  try {
    const res = await http.get<BookmarksResponseType>("/users/bookmarks", {
      params: { page, limit },
    });

    return {
      posts: res.data.data.bookmarks,
      nextPage: res.data.meta.pagination.nextPage ?? null,
    };
  } catch (err) {
    handleApiError(err);
  }
}
