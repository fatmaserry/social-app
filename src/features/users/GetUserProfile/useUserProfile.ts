import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "./getUserProfile.api";
import { userProfileKeys } from "./getUserProfile.keys";

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: userProfileKeys.detail(userId),
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
  });
}
