// hooks/useCreateStripeOrder.ts
import { createStripeOrder } from "@/api/orderApi";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

export const useCreateStripeOrder = () => {
  return useMutation({
    mutationFn: createStripeOrder,
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error placing Stripe order");
      }
    },
  });
};
