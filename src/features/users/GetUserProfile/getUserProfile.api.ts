import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";
import type { UserProfileData, UserProfileResponseType } from "./getUserProfile.interface";

export async function getUserProfile(userId: string): Promise<UserProfileData> {
  try {
    const res = await http.get<UserProfileResponseType>(`/users/${userId}/profile`);

    return { user: res.data.data.user, isFollowing: res.data.data.isFollowing };
  } catch (err) {
    handleApiError(err);
  }
}
