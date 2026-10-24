import { Form } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema } from "./login.zod";
import type { LoginUserDataType } from "./login.interface";
import AppButton from "@/SharedComponents/AppButton/AppButton";
import AppInput from "@/SharedComponents/AppInput/AppInput";
import { useLogin } from "../hooks/useLogin";

function LoginForm() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
    resolver: zodResolver(loginSchema),
  });

  const { login, isPending } = useLogin();

  function sendUserData(data: LoginUserDataType) {
    return login(data)
      .then(() => reset())
      .catch(() => {});
  }

  return (
    <Form onSubmit={handleSubmit(sendUserData)} className="flex flex-col gap-5">
      <AppInput
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="off"
        error={errors.email?.message}
        {...register("email")}
      />

      <AppInput
        label="Password"
        type="password"
        placeholder="••••••••"
        autoComplete="off"
        error={errors.password?.message}
        {...register("password")}
      />

      <AppButton
        isDisabled={isPending}
        fullWidth
        type="submit"
        className="mt-2"
      >
        Log in
      </AppButton>
    </Form>
  );
}

export default LoginForm;
