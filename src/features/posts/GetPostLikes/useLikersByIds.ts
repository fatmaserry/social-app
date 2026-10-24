import { useQueries } from "@tanstack/react-query";
import { getUserProfile } from "@/features/users/GetUserProfile/getUserProfile.api";
import { userProfileKeys } from "@/features/users/GetUserProfile/getUserProfile.keys";
import type { PostLiker } from "./getPostLikes.interface";

// The API has no "who liked this comment" endpoint, only the liker ids,
// so each id is resolved through the profile endpoint.
export function useLikersByIds(userIds: string[], enabled: boolean) {
  const results = useQueries({
    queries: userIds.map((userId) => ({
      queryKey: userProfileKeys.detail(userId),
      queryFn: () => getUserProfile(userId),
      enabled,
    })),
  });

  const likers: PostLiker[] = results.flatMap((result) =>
    result.data ? [result.data.user] : [],
  );

  return {
    likers,
    isLoading: enabled && results.some((result) => result.isLoading),
  };
}
