import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";
import type { LoginResponseType, LoginUserDataType } from "./login.interface";

export async function userLogin(
  userData: LoginUserDataType,
): Promise<LoginResponseType> {
  try {
    const data = await http.post<LoginResponseType>("/users/signin", userData);

    return data.data;
  } catch (err) {
    handleApiError(err);
  }
}
