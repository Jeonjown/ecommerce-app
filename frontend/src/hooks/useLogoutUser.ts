import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export const useLogoutUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(["loggedInUser"], null);
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      navigate("/login");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Logout failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
};
