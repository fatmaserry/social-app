import http from "@/lib/http";
import { handleApiError } from "@/lib/handleApiError";

export async function uploadProfilePhoto(photo: File): Promise<void> {
  const formData = new FormData();
  formData.append("photo", photo);

  try {
    await http.put("/users/upload-photo", formData);
  } catch (err) {
    handleApiError(err);
  }
}
