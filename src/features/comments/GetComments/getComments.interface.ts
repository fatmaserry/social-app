import type { RawComment } from "../comments.mappers";

export interface CommentsResponseType {
  success: boolean;
  message: string;
  data: {
    comments: RawComment[];
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
