import * as zod from "zod";

export const loginSchema = zod.object({
  email: zod.email(),
  password: zod.string().min(1, "Password is required"),
});
