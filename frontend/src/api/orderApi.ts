import { isAxiosError } from "axios";
import api from "./axios";
import type {
  CancelOrderPayload,
  CancelOrderResponse,
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

export const updateOrderStatus = async (
  orderId: number,
  payload: {
    payment_status?: string;
    order_status?: string;
    refund_status?: string;
  },
): Promise<OrderResponse> => {
  try {
    const res = await api.patch(`/orders/${orderId}/status`, payload, {
      withCredentials: true,
    });
    return res.data as OrderResponse;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to update order status.",
      );
    }
    throw new Error("Unexpected error updating order status.");
  }
};

export const requestCancelOrder = async (
  orderId: number,
  payload: CancelOrderPayload,
): Promise<CancelOrderResponse> => {
  try {
    const res = await api.post(`/orders/${orderId}/request-cancel`, payload, {
      withCredentials: true,
    });
    return res.data as CancelOrderResponse;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          "Failed to request order cancellation.",
      );
    }
    throw new Error("Unexpected error requesting cancellation.");
  }
};

export const getOrderByIdForAdmin = async (
  orderId: number,
): Promise<OrderResponse> => {
  try {
    const res = await api.get(`/orders/admin/${orderId}`, {
      withCredentials: true,
    });

    return res.data as OrderResponse;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch admin order details.",
      );
    }
    throw new Error("Unexpected error fetching admin order details.");
  }
};
