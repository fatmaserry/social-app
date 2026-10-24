import axios from "axios";
import http from "@/lib/http";
import type { LoginResponseType, LoginUserDataType } from "./login.interface";

export async function userLogin(userData: LoginUserDataType): Promise<LoginResponseType> {
  try {
    const data = await http.post<LoginResponseType>("/users/signin", userData);

    return data.data;
  } catch (err) {
    if (axios.isAxiosError<{ message: string }>(err)) {
      throw new Error(err.response?.data.message);
    }

    throw new Error("NetWork Error");
  }
}
