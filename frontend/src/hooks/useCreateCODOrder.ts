import { createCODOrder } from "@/api/orderApi";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useClearCartItem } from "./useClearCartItem";

export const useCreateCODOrder = () => {
  const { mutate } = useClearCartItem();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createCODOrder,
    onSuccess: () => {
      navigate(`/order-success`);

      mutate();
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
