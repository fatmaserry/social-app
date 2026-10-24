import axios from "axios";
import http from "@/lib/http";
import type { RegisterResponseType, UserDataType } from "./register.interface";

export async function userRegister(userData: UserDataType): Promise<string> {
  try {
    const res = await http.post<RegisterResponseType>("/users/signup", userData);

    return res.data.message;
  } catch (err) {
    if (axios.isAxiosError<{ message: string }>(err)) {
      throw new Error(err.response?.data.message);
    }

    throw new Error("NetWork Error");
  }
}
