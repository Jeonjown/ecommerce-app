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
    onSuccess: (data) => {
      queryClient.setQueryData(["loggedInUser"], null);
      toast.success(data.message || "Logged out successfully");
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
