import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";
import type {
  FollowResponseType,
  SuggestedUsersPage,
  SuggestedUsersResponseType,
  UserSearchResponseType,
  UserSearchResult,
} from "./users.interface";

export async function getSuggestedUsers({
  page,
  limit = 5,
}: {
  page: number;
  limit?: number;
}): Promise<SuggestedUsersPage> {
  try {
    const res = await http.get<SuggestedUsersResponseType>("/users/suggestions", {
      params: { page, limit },
    });

    return {
      users: res.data.data.suggestions,
      numberOfPages: res.data.meta.pagination.numberOfPages,
    };
  } catch (err) {
    handleApiError(err);
  }
}

export async function searchUsers(query: string): Promise<UserSearchResult[]> {
  try {
    const res = await http.get<UserSearchResponseType>("/users/search", {
      params: { q: query, page: 1, limit: 6 },
    });

    return res.data.data.users;
  } catch (err) {
    handleApiError(err);
  }
}

export async function toggleFollow(userId: string): Promise<void> {
  try {
    await http.put<FollowResponseType>(`/users/${userId}/follow`);
  } catch (err) {
    handleApiError(err);
  }
}
