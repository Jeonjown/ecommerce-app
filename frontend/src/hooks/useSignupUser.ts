import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import type { SignupRequest, AuthResponse } from "../types/api/auth";
import { signupUser } from "../api/authApi";

export const useSignupUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<AuthResponse, Error, SignupRequest>({
    mutationFn: signupUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["loggedInUser"] });
      toast.success(data.message);
      navigate("/");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to sign up");
      } else {
        toast.error(error.message || "Unexpected error");
      }
    },
  });
};
