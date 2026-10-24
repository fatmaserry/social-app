import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";
import type { ChangePasswordResponseType } from "./changePassword.interface";

export async function changePassword({
  password,
  newPassword,
}: {
  password: string;
  newPassword: string;
}): Promise<ChangePasswordResponseType["data"]> {
  try {
    const res = await http.patch<ChangePasswordResponseType>(
      "/users/change-password",
      {
        password,
        newPassword,
      },
    );

    return res.data.data;
  } catch (err) {
    handleApiError(err);
  }
}
