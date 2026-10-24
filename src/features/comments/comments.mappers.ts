import type { Comment, CommentAuthor } from "./comments.interface";

export interface RawComment {
  _id: string;
  content: string;
  image?: string;
  commentCreator: CommentAuthor;
  post: string;
  parentComment: string | null;
  likes: string[];
  likesCount?: number;
  createdAt: string;
  repliesCount?: number;
}

export function toComment(raw: RawComment): Comment {
  return {
    _id: raw._id,
    content: raw.content,
    image: raw.image,
    user: raw.commentCreator,
    createdAt: raw.createdAt,
    likes: raw.likes,
    likesCount: raw.likesCount ?? raw.likes.length,
    repliesCount: raw.repliesCount,
  };
}
