import http from "@/lib/http";
import type {
  UserData,
  UserDataResponseType,
} from "./userAuthProvider.interface";

export async function getUserData(): Promise<null | UserData> {
  try {
    const res = await http.get<UserDataResponseType>("/users/profile-data");

    return res.data.data.user;
  } catch {
    return null;
  }
}
