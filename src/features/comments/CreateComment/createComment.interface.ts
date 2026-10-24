import type { Comment } from "../comments.interface";

export interface CreateCommentResponseType {
  success: boolean;
  message: string;
  data: {
    comment: Comment;
  };
}
