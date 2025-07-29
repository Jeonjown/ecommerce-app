import { isAxiosError } from "axios";
import api from "./axios";
import type {
  CreateProductRequest,
  CreateProductResponse,
  ProductResponse,
  UpdateProductPayload,
} from "@/types/api/products";

export const getProducts = async (): Promise<ProductResponse> => {
  try {
    const response = await api.get("/products", { withCredentials: true });
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch products.",
      );
    }
    throw new Error("Unexpected error fetching products.");
  }
};

export const createProduct = async (
  payload: CreateProductRequest,
): Promise<CreateProductResponse> => {
  try {
    const response = await api.post("/products", payload, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to create product.",
      );
    }
    throw new Error("Unexpected error creating product.");
  }
};

export const updateProduct = async (
  id: number,
  payload: UpdateProductPayload,
): Promise<ProductResponse> => {
  try {
    const response = await api.put(`/products/${id}`, payload, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to update product.",
      );
    }
    throw new Error("Unexpected error updating product.");
  }
};

export const deleteProduct = async (productId: number): Promise<void> => {
  try {
    await api.delete(`/products/${productId}`, { withCredentials: true });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to delete product.",
      );
    }
    throw new Error("Unexpected error deleting product.");
  }
};
