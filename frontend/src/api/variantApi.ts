import { isAxiosError } from "axios";
import api from "./axios";
import type {
  CreateVariantPayload,
  UpdateVariantPayload,
  Variant,
} from "@/types/api/variant";
import type { VariantOption } from "@/types/api/products";

export const getVariantsByProductId = async (
  id: number,
): Promise<Variant[]> => {
  try {
    const response = await api.get(`/products/${id}/variants`, {
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

export const getVariantOptions = async (
  variantId: number,
): Promise<VariantOption[]> => {
  try {
    const response = await api.get(`/products/variants/${variantId}/options`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to delete variant.",
      );
    }
    throw new Error("Unexpected error deleting variant.");
  }
};

export const getVariantById = async (id: number): Promise<Variant> => {
  try {
    const response = await api.get(`/products/variants/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch variant by ID.",
      );
    }
    throw new Error("Unexpected error fetching variant.");
  }
};

export const deleteVariantById = async (id: number) => {
  try {
    const response = await api.delete(`/products/variants/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to delete variant.",
      );
    }
    throw new Error("Unexpected error deleting variant.");
  }
};

export const createVariantByProductId = async (
  id: number,
  payload: CreateVariantPayload,
) => {
  try {
    const response = await api.post(`/products/variants/${id}`, payload, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to create variant.",
      );
    }
    throw new Error("Unexpected error creating variant.");
  }
};

export const updateVariantById = async (
  id: number,
  payload: UpdateVariantPayload,
) => {
  try {
    const response = await api.patch(`products/variants/${id}`, payload, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to update variant.",
      );
    }
    throw new Error("Unexpected error updating variant.");
  }
};
