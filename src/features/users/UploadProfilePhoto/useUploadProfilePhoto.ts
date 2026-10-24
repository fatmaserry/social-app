import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { UserAuthContext } from "@/app/providers/UserAuthProvider/UserAuthProvider";
import { getUserData } from "@/app/providers/UserAuthProvider/userAuthProvider.services";
import { uploadProfilePhoto } from "./uploadProfilePhoto.api";

export function useUploadProfilePhoto() {
  const { setUserData } = useContext(UserAuthContext);

  return useMutation({
    mutationFn: uploadProfilePhoto,
    onSuccess: async () => {
      const fresh = await getUserData();
      if (fresh) setUserData(fresh);
    },
  });
}
