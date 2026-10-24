import { Form } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import AppButton from "@/SharedComponents/AppButton/AppButton";
import AppInput from "@/SharedComponents/AppInput/AppInput";
import PasswordChecklist from "@/features/auth/register/PasswordChecklist";
import { changePasswordSchema } from "./changePassword.zod";
import type { ChangePasswordFormData } from "./changePassword.zod";
import { useChangePassword } from "./useChangePassword";

function ChangePasswordForm() {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    defaultValues: { password: "", newPassword: "", confirmNewPassword: "" },
    mode: "all",
    resolver: zodResolver(changePasswordSchema),
  });

  const newPassword = useWatch({ control, name: "newPassword" });
  const confirmNewPassword = useWatch({ control, name: "confirmNewPassword" });

  const { mutateAsync, isPending } = useChangePassword();

  function onSubmit(values: ChangePasswordFormData) {
    return toast
      .promise(
        mutateAsync({
          password: values.password,
          newPassword: values.newPassword,
        }),
        {
          loading: "Updating password…",
          success: "Password updated",
          error: (err) => err.message,
        },
      )
      .then(() => reset())
      .catch(() => {});
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <AppInput
        label="Current password"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="grid grid-cols-2 gap-4">
        <AppInput
          label="New password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.newPassword?.message}
          hideError
          {...register("newPassword")}
        />

        <AppInput
          label="Confirm new password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.confirmNewPassword?.message}
          hideError
          {...register("confirmNewPassword")}
        />
      </div>

      <PasswordChecklist
        password={newPassword ?? ""}
        confirmPassword={confirmNewPassword ?? ""}
      />

      <AppButton
        isDisabled={isPending}
        fullWidth
        type="submit"
        className="mt-2"
      >
        Update password
      </AppButton>
    </Form>
  );
}

export default ChangePasswordForm;
