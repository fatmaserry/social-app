export interface CommentAuthor {
  _id: string;
  name: string;
  photo?: string;
}

export interface Comment {
  _id: string;
  content: string;
  image?: string;
  commentCreator: CommentAuthor;
  post: string;
  parentComment: string | null;
  likes: string[];
  createdAt: string;
  repliesCount?: number;
}

export interface CommentsPage {
  comments: Comment[];
  nextPage: number | null;
}
