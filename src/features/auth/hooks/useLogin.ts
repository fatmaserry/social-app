import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { UserAuthContext } from "@/app/providers/UserAuthProvider/UserAuthProvider";
import { userLogin } from "../login/login.services";
import type { LoginUserDataType } from "../login/login.interface";

export function useLogin() {
  const navigate = useNavigate();
  const { setUserData } = useContext(UserAuthContext);
  const mutation = useMutation({ mutationFn: userLogin });

  function login(values: LoginUserDataType) {
    return toast.promise(mutation.mutateAsync(values), {
      loading: "Signing you in…",
      success: (data) => {
        localStorage.setItem("user_tkn", data.data.token);
        setUserData(data.data.user);
        navigate("/");
        return "Welcome back!";
      },
      error: (err) => err.message,
    });
  }

  return { login, isPending: mutation.isPending };
}
