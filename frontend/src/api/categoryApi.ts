import api from "./axios";
import { isAxiosError } from "axios";
import type { Category } from "@/types/api/categories";
import type { ProductResponse } from "@/types/api/products";

export const getCategories = async (): Promise<{ categories: Category[] }> => {
  try {
    const res = await api.get("/categories", { withCredentials: true });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch categories.",
      );
    }
    throw new Error("Unexpected error fetching categories.");
  }
};

export const getCategoryById = async (id: number): Promise<Category> => {
  try {
    const res = await api.get(`/categories/${id}`, { withCredentials: true });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch category.",
      );
    }
    throw new Error("Unexpected error fetching category.");
  }
};

export const getProductsByCategorySlug = async (
  slug: string,
): Promise<ProductResponse> => {
  try {
    const res = await api.get(`/categories/${slug}/products`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch products.",
      );
    }
    throw new Error("Unexpected error fetching products.");
  }
};

export const createCategory = async (name: string): Promise<Category> => {
  try {
    const res = await api.post(
      "/categories",
      { name },
      { withCredentials: true },
    );
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to create category.",
      );
    }
    throw new Error("Unexpected error creating category.");
  }
};

// EDIT a category
export const editCategory = async (
  id: number,
  name: string,
): Promise<Category> => {
  try {
    const res = await api.patch(
      `/categories/${id}`,
      { name },
      { withCredentials: true },
    );
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to update category.",
      );
    }
    throw new Error("Unexpected error updating category.");
  }
};

// DELETE a category
export const deleteCategory = async (id: number): Promise<void> => {
  try {
    const res = await api.delete(`/categories/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to delete category.",
      );
    }
    throw new Error("Unexpected error deleting category.");
  }
};
