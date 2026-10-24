import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { userRegister } from "../register/register.services";
import type { UserDataType } from "../register/register.interface";

export function useRegister() {
  const navigate = useNavigate();
  const mutation = useMutation({ mutationFn: userRegister });

  function register(values: UserDataType) {
    return toast.promise(mutation.mutateAsync(values), {
      loading: "Creating your account…",
      success: (message) => {
        navigate("/login");
        return message;
      },
      error: "Something went wrong, please try again",
    });
  }

  return { register, isPending: mutation.isPending };
}
