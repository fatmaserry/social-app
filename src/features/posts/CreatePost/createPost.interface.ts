export interface CreatedPost {
  _id: string;
  body: string;
  image?: string;
  user: string;
  createdAt: string;
  likesCount: number;
}

export interface CreatePostResponseType {
  success: boolean;
  message: string;
  data: {
    post: CreatedPost;
  };
}
