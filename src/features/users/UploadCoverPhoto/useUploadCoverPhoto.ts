import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserAuthContext } from "@/app/providers/UserAuthProvider/UserAuthProvider";
import { postsFeedKeys } from "@/features/posts/GetPostsFeed/getPostsFeed.keys";
import { userPostsKeys } from "@/features/posts/GetUserPosts/getUserPosts.keys";
import { uploadCoverPhoto } from "./uploadCoverPhoto.api";
import type { PostPrivacy } from "@/features/posts/posts.interface";

export function useUploadCoverPhoto() {
  const { userData, setUserData } = useContext(UserAuthContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: { cover: File; privacy: PostPrivacy }) =>
      uploadCoverPhoto(vars),
    onSuccess: (coverUrl) => {
      setUserData((old) => (old ? { ...old, cover: coverUrl } : old));
      queryClient.invalidateQueries({ queryKey: postsFeedKeys.all });
      if (userData) {
        queryClient.invalidateQueries({
          queryKey: userPostsKeys.user(userData._id),
        });
      }
    },
  });
}
