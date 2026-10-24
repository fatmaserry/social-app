import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";
import type { RegisterResponseType, UserDataType } from "./register.interface";

export async function userRegister(userData: UserDataType): Promise<string> {
  try {
    const res = await http.post<RegisterResponseType>(
      "/users/signup",
      userData,
    );

    return res.data.message;
  } catch (err) {
    handleApiError(err);
  }
}
