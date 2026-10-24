import type { RawComment } from "../comments.mappers";

export interface RepliesResponseType {
  success: boolean;
  message: string;
  data: {
    replies: RawComment[];
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
