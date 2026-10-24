import type { Comment } from "../comments.interface";

export interface CommentsResponseType {
  success: boolean;
  message: string;
  data: {
    comments: Comment[];
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
