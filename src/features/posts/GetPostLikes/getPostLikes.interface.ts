import type { PostAuthor } from "../posts.interface";

export interface PostLiker extends PostAuthor {
  username?: string;
}

export interface PostLikesResponseType {
  success: boolean;
  message: string;
  data: {
    likes: PostLiker[];
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

export interface PostLikesPage {
  likers: PostLiker[];
  nextPage: number | null;
}
