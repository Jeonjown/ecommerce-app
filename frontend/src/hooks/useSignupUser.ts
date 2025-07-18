import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import type { SignupRequest, AuthResponse } from "../types/api/auth";
import { signupUser } from "../api/authApi";

export const useSignupUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<AuthResponse, Error, SignupRequest>({
    mutationFn: signupUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loggedInUser"] });
      navigate("/");
    },
  });
};
