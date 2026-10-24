import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";

export async function deleteCoverPhoto(): Promise<void> {
  try {
    await http.delete("/users/cover");
  } catch (err) {
    handleApiError(err);
  }
}
