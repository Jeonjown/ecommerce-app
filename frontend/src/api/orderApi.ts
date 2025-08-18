import { isAxiosError } from "axios";
import api from "./axios";
import type { OrderItem, OrderPayload } from "@/types/api/orders";

export const createStripeOrder = async (payload: OrderPayload) => {
  try {
    const res = await api.post("/orders/stripe", payload, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to create Stripe checkout session.",
      );
    }
    throw new Error("Unexpected error creating Stripe order.");
  }
};

export const createCODOrder = async (payload: OrderPayload) => {
  try {
    const res = await api.post("/orders/cod", payload, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to create COD order.",
      );
    }
    throw new Error("Unexpected error creating COD order.");
  }
};

export const getOrdersByUserId = async (): Promise<OrderItem[]> => {
  try {
    const res = await api.get("/orders/me", { withCredentials: true });
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user orders.",
      );
    }
    throw new Error("Unexpected error fetching user orders.");
  }
};
