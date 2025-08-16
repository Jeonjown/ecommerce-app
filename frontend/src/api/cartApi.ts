import { isAxiosError } from "axios";
import api from "./axios";
import type { CartItem } from "@/types/api/cart";

export const syncUserCart = async (
  cartItems: CartItem[],
): Promise<{ message: string }> => {
  try {
    const res = await api.post("/cart/sync", cartItems, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to sync cart.");
    }
    throw new Error("Unexpected error syncing cart.");
  }
};

export const getCartItemsByLoggedUser = async (): Promise<CartItem[]> => {
  try {
    const res = await api.get("/cart", {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) return [];
      throw new Error(
        error.response?.data?.message || "Failed to fetch cart items.",
      );
    }
    throw new Error("Unexpected error fetching cart items.");
  }
};

export const addItemToCart = async (
  cartItem: CartItem,
): Promise<{ message: string }> => {
  try {
    const res = await api.post("/cart", cartItem, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to add item to cart.",
      );
    }
    throw new Error("Unexpected error adding item to cart.");
  }
};

export const updateCartItem = async (
  cartItem: CartItem,
): Promise<{ message: string }> => {
  try {
    const res = await api.put("/cart", cartItem, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to update cart item.",
      );
    }
    throw new Error("Unexpected error updating cart item.");
  }
};

export const removeCartItem = async (
  variant_id: number,
): Promise<{ message: string }> => {
  try {
    const res = await api.delete(`/cart/${variant_id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to remove cart item.",
      );
    }
    throw new Error("Unexpected error removing cart item.");
  }
};

export const clearCartItem = async (): Promise<{ message: string }> => {
  try {
    const res = await api.delete(`/cart/clear`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to remove cart item.",
      );
    }
    throw new Error("Unexpected error removing cart item.");
  }
};
