import { isAxiosError } from "axios";
import api from "./axios";
import type { Variant } from "@/types/api/variant";

export const getVariantsByProductId = async (
  id: number,
): Promise<Variant[]> => {
  try {
    const response = await api.get(`/products/variants/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch variants.",
      );
    }
    throw new Error("Unexpected error fetching variants.");
  }
};
