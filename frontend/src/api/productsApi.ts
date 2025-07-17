import { isAxiosError } from "axios";
import api from "./axios";
import type { ProductResponse } from "@/types/api/products";

export const getProducts = async (): Promise<ProductResponse> => {
  try {
    const response = await api.get("/products", { withCredentials: true });
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch logged-in user.",
      );
    }
    throw new Error("Unexpected error fetching logged-in user.");
  }
};
