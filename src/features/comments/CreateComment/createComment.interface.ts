import type { RawComment } from "../comments.mappers";

export interface CreateCommentResponseType {
  success: boolean;
  message: string;
  data: {
    comment: RawComment;
  };
}
