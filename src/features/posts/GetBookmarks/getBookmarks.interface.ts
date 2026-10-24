import type { Post } from "../posts.interface";

export interface BookmarksResponseType {
  success: boolean;
  message: string;
  data: {
    bookmarks: Post[];
  };
  meta: {
    pagination: {
      currentPage: number;
      numberOfPages: number;
      limit: number;
      total: number;
      nextPage?: number;
      prevPage?: number;
    };
  };
}
