import { requestCancelOrder } from "@/api/orderApi";
import type {
  CancelOrderResponse,
  CancelOrderPayload,
} from "@/types/api/orders";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRequestCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CancelOrderResponse,
    Error,
    { orderId: number; payload: CancelOrderPayload }
  >({
    mutationFn: ({ orderId, payload }) => requestCancelOrder(orderId, payload),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(`Your request for order #${orderId} was submitted.`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit your request.");
    },
  });
};
