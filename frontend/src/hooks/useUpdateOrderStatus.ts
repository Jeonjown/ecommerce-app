import { updateOrderStatus } from "@/api/orderApi";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: number;
      payload: {
        payment_status?: string;
        order_status?: string;
        refund_status?: string;
      };
    }) => updateOrderStatus(orderId, payload),

    onSuccess: () => {
      // Refetch relevant queries so UI updates
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
