export interface PublicUserProfile {
  _id: string;
  name: string;
  username: string;
  photo?: string;
  cover?: string;
  followersCount?: number;
  followingCount?: number;
  followers?: ProfileConnection[];
  following?: ProfileConnection[];
  bookmarksCount?: number;
}

export interface ProfileConnection {
  _id: string;
  name: string;
  username?: string;
  photo?: string;
}

export interface UserProfileResponseType {
  success: boolean;
  message: string;
  data: {
    isFollowing: boolean;
    user: PublicUserProfile;
  };
}

export interface UserProfileData {
  user: PublicUserProfile;
  isFollowing: boolean;
}
