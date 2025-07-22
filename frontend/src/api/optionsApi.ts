import { isAxiosError } from "axios";
import api from "./axios";
import type { OptionResponse } from "@/types/api/options";

export const getOptionsByProductId = async (
  id: string,
): Promise<OptionResponse> => {
  try {
    const response = await api.get(`/products/options/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch options.",
      );
    }
    throw new Error("Unexpected error fetching options.");
  }
};

export const deleteOptionByOptionId = async (id: string) => {
  try {
    const response = await api.delete(`/products/options/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to delete options.",
      );
    }
    throw new Error("Unexpected error deleting options.");
  }
};

// add option
// edit option
// delete option
