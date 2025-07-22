import { isAxiosError } from "axios";
import api from "./axios";
import type {
  CreateProductRequest,
  CreateProductResponse,
  ProductResponse,
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
