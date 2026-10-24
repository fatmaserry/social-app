import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { UserAuthContext } from "@/app/providers/UserAuthProvider/UserAuthProvider";
import { deleteCoverPhoto } from "./deleteCoverPhoto.api";

export function useDeleteCoverPhoto() {
  const { setUserData } = useContext(UserAuthContext);

  return useMutation({
    mutationFn: deleteCoverPhoto,
    onSuccess: () => {
      setUserData((old) => (old ? { ...old, cover: "" } : old));
    },
  });
}
