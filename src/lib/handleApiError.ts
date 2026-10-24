import axios from "axios";

export function handleApiError(err: unknown): never {
  if (axios.isAxiosError<{ message: string }>(err)) {
    throw new Error(err.response?.data.message);
  }

  throw new Error("Network Error");
}
