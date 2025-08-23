import type { Address } from "@/types/api/address";
import api from "./axios";
import { isAxiosError } from "axios";

export const getAddresses = async (): Promise<{ addresses: Address[] }> => {
  try {
    const res = await api.get("/users/address/me", { withCredentials: true });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch addresses.",
      );
    }
    throw new Error("Unexpected error fetching addresses.");
  }
};

export const getAddressById = async (
  id: number,
): Promise<{ address: Address }> => {
  try {
    const res = await api.get(`/users/address/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch address.",
      );
    }
    throw new Error("Unexpected error fetching address.");
  }
};

export const createAddress = async (
  address: Omit<Address, "id" | "created_at" | "user_id">,
): Promise<{ address: Address }> => {
  try {
    const res = await api.post("/users/address", address, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to create address.",
      );
    }
    throw new Error("Unexpected error creating address.");
  }
};

export const updateAddress = async (
  id: number,
  payload: Partial<Address>,
): Promise<{ message: string }> => {
  try {
    const res = await api.patch(`/users/address/${id}`, payload, {
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to update address.",
      );
    }
    throw new Error("Unexpected error updating address.");
  }
};

export const deleteAddress = async (
  id: number,
): Promise<{ message: string }> => {
  try {
    const res = await api.delete(`/users/address/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to delete address.",
      );
    }
    throw new Error("Unexpected error deleting address.");
  }
};
