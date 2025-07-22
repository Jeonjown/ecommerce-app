import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "../api/authApi";
import type { AuthResponse, LoginRequest } from "../types/api/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export const useLoginUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["loggedInUser"] });
      toast.success(data.message || "Login successful");
      navigate("/");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Login failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
};
