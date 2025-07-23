import { isAxiosError } from "axios";
import api from "./axios";
import type {
  CreateOptionValueRequest,
  OptionValueResponse,
} from "@/types/api/optionValue";

export const createOptionValue = async ({
  id,
  value,
}: CreateOptionValueRequest): Promise<OptionValueResponse> => {
  try {
    const response = await api.post(
      `/products/options-value/${id}`,
      { value },
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

export const deleteOptionValue = async (
  id: number,
): Promise<OptionValueResponse> => {
  try {
    const response = await api.delete(`/products/options-value/${id}`, {
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
