import type { Categories, Category } from "@/types/api/categories";
import api from "./axios";
import { isAxiosError } from "axios";

export const getCategoryById = async (id: string): Promise<Category> => {
  try {
    const response = await api.get(`/categories/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch category.",
      );
    }
    throw new Error("Unexpected error fetching category.");
  }
};

export const getCategories = async (): Promise<Categories> => {
  try {
    const response = await api.get(`/categories`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch category.",
      );
    }
    throw new Error("Unexpected error fetching category.");
  }
};
