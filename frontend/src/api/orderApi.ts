import { isAxiosError } from "axios";
import api from "./axios";
import type {
  OrderItem,
  OrderPayload,
  OrderResponse,
} from "@/types/api/orders";

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

export const getOrderById = async (orderId: number): Promise<OrderResponse> => {
  try {
    const res = await api.get(`/orders/${orderId}`, { withCredentials: true });
    return res.data as OrderResponse;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch order details.",
      );
    }
    throw new Error("Unexpected error fetching order details.");
  }
};

export const getAllOrders = async (): Promise<OrderResponse[]> => {
  try {
    const res = await api.get("/orders", { withCredentials: true });
    return res.data as OrderResponse[];
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch orders.",
      );
    }
    throw new Error("Unexpected error fetching orders.");
  }
};
