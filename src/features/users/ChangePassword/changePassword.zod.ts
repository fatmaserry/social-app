import * as zod from "zod";
import {
  isValidPassword,
  passwordRequirementsMessage,
  passwordsMatch,
} from "@/features/auth/register/password.rules";

export const changePasswordSchema = zod
  .object({
    password: zod.string().min(1, "Current password is required"),
    newPassword: zod.string().refine(isValidPassword, passwordRequirementsMessage),
    confirmNewPassword: zod.string().refine(isValidPassword, passwordRequirementsMessage),
  })
  .refine((value) => passwordsMatch(value.newPassword, value.confirmNewPassword), {
    path: ["confirmNewPassword"],
    error: "Passwords don't match",
  });

export type ChangePasswordFormData = zod.infer<typeof changePasswordSchema>;
