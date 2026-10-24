export interface UploadCoverResponseType {
  success: boolean;
  message: string;
  data: {
    cover: string;
    postId: string;
  };
}
