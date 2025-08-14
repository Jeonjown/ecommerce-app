import { isAxiosError } from "axios";
import api from "./axios";
import type { OrderPayload } from "@/types/api/orders";

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
