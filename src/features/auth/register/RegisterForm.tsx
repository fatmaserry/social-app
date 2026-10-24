import { Form } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { registerSchema } from "./register.zod";
import type { UserDataType } from "./register.interface";
import AppButton from "@/SharedComponents/AppButton/AppButton";
import AppInput from "@/SharedComponents/AppInput/AppInput";
import AppSelect from "@/SharedComponents/AppSelect/AppSelect";
import PasswordChecklist from "./PasswordChecklist";
import { useRegister } from "../hooks/useRegister";

const genderOptions = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
];

function RegisterForm() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm<UserDataType>({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "male",
      password: "",
      rePassword: "",
    },
    mode: "all",
    resolver: zodResolver(registerSchema),
  });

  const password = useWatch({ control, name: "password" });
  const confirmPassword = useWatch({ control, name: "rePassword" });

  const { register: submitRegister, isPending } = useRegister();

  function sendUserData(data: UserDataType) {
    return submitRegister(data).catch(() => {});
  }

  return (
    <Form onSubmit={handleSubmit(sendUserData)} className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <AppInput
          label="Name"
          type="text"
          placeholder="Jane Doe"
          autoComplete="off"
          error={errors.name?.message}
          {...register("name")}
        />

        <AppInput
          label="Username"
          type="text"
          placeholder="janedoe"
          autoComplete="off"
          error={errors.username?.message}
          {...register("username")}
        />
      </div>

      <AppInput
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="off"
        error={errors.email?.message}
        {...register("email")}
      />

      <div className="grid grid-cols-2 gap-4">
        <AppInput
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="off"
          error={errors.password?.message}
          hideError
          {...register("password")}
        />

        <AppInput
          label="Confirm"
          type="password"
          placeholder="••••••••"
          autoComplete="off"
          error={errors.rePassword?.message}
          hideError
          {...register("rePassword")}
        />
      </div>

      <PasswordChecklist
        password={password ?? ""}
        confirmPassword={confirmPassword ?? ""}
      />

      <div className="grid grid-cols-2 gap-4">
        <AppInput
          label="Date of birth"
          type="date"
          error={errors.dateOfBirth?.message}
          {...register("dateOfBirth")}
        />

        <Controller
          name="gender"
          control={control}
          render={function ({ field }) {
            return (
              <AppSelect
                {...field}
                label="Gender"
                options={genderOptions}
                error={errors.gender?.message}
              />
            );
          }}
        />
      </div>

      <AppButton
        isDisabled={isPending}
        fullWidth
        type="submit"
        className="mt-2"
      >
        Sign up
      </AppButton>
    </Form>
  );
}

export default RegisterForm;
