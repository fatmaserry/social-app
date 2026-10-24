import type { Comment } from "../comments.interface";

export interface RepliesResponseType {
  success: boolean;
  message: string;
  data: {
    replies: Comment[];
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
