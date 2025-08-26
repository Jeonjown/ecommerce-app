import { isAxiosError } from "axios";
import api from "./axios";
import type { OptionResponse } from "@/types/api/options";

export const getOptionsByProductId = async (
  id: number,
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

export const deleteOptionByOptionId = async (id: number) => {
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

export const createOptionByProductId = async (id: number, name: string) => {
  try {
    const response = await api.post(
      `/products/options/${id}`,
      { name },
      { withCredentials: true },
    );
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
