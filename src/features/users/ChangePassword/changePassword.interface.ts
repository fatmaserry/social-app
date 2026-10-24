export interface ChangePasswordResponseType {
  success: boolean;
  message: string;
  data: {
    token?: string;
    user?: {
      _id: string;
      name: string;
      username: string;
      email: string;
      photo: string;
      cover: string;
    };
  };
}
