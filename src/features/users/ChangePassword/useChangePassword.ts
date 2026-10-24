import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { UserAuthContext } from "@/app/providers/UserAuthProvider/UserAuthProvider";
import { changePassword } from "./changePassword.api";

export function useChangePassword() {
  const { setUserData } = useContext(UserAuthContext);

  return useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      if (data.token) localStorage.setItem("user_tkn", data.token);
      if (data.user) setUserData((old) => (old ? { ...old, ...data.user } : old));
    },
  });
}
