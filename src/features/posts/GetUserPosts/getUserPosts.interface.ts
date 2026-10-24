import type { Post } from "../posts.interface";

export interface UserPostsResponseType {
  success: boolean;
  message: string;
  data: {
    posts: Post[];
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
