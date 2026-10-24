import * as zod from "zod";
import { isValidPassword, passwordRequirementsMessage, passwordsMatch } from "./password.rules";

export const registerSchema = zod
  .object({
    name: zod.string().regex(/^[a-zA-Z0-9_\s]+$/, "Enter a valid name"),
    username: zod.string().regex(/^[a-zA-Z0-9_\s]+$/, "Enter a valid username"),
    email: zod.email(),
    password: zod.string().refine(isValidPassword, passwordRequirementsMessage),
    rePassword: zod.string().refine(isValidPassword, passwordRequirementsMessage),
    dateOfBirth: zod.string().refine(function (value) {
      const birthDate = new Date(value);
      const currentYear = new Date();
      return currentYear.getFullYear() - birthDate.getFullYear() > 20;
    }, "Your Age Must Be Above 20 Years Old"),
    gender: zod.enum(["male", "female"]),
  })
  .refine(function (value) {
    return passwordsMatch(value.password, value.rePassword);
  }, {
    path: ["rePassword"],
    error: "Password not the same as Confirm Password",
  });