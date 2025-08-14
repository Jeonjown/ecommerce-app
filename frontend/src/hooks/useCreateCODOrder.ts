import { createCODOrder } from "@/api/orderApi";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useCreateCODOrder = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createCODOrder,
    onSuccess: ({ orderId }) => {
      navigate(`/order-success/${orderId}`);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error placing COD order");
      }
    },
  });
};
