export interface CommentAuthor {
  _id: string;
  name: string;
  photo?: string;
}

export interface Comment {
  _id: string;
  content: string;
  image?: string;
  user: CommentAuthor;
  createdAt: string;
  likesCount: number;
  likes: string[];
  repliesCount?: number;
}

export interface CommentsPage {
  comments: Comment[];
  nextPage: number | null;
}
