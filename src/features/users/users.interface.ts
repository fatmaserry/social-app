export interface SuggestedUser {
  _id: string;
  name: string;
  username: string;
  photo?: string;
  mutualFollowersCount: number;
  followersCount: number;
}

export interface SuggestedUsersPage {
  users: SuggestedUser[];
  numberOfPages: number;
}

export interface SuggestedUsersResponseType {
  success: boolean;
  message: string;
  data: {
    suggestions: SuggestedUser[];
  };
  meta: {
    pagination: {
      currentPage: number;
      limit: number;
      total: number;
      numberOfPages: number;
      nextPage?: number;
    };
  };
}

export interface FollowResponseType {
  success: boolean;
  message: string;
}

export interface UserSearchResult {
  _id: string;
  name: string;
  username: string;
  photo?: string;
}

export interface UserSearchResponseType {
  success: boolean;
  message: string;
  data: {
    users: UserSearchResult[];
  };
}
