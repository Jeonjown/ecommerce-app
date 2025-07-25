import { isAxiosError } from "axios";
import api from "./axios";

export const uploadImage = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    const response = await api.post("/images/upload", formData, {
      withCredentials: true,
      transformRequest: [(data) => data],
    });

    return response.data.url;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to upload image.",
      );
    }
    throw new Error("Unexpected error uploading image.");
  }
};
