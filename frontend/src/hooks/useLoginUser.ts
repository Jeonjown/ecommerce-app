import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "../api/authApi";
import type { AuthResponse, LoginRequest } from "../types/api/auth";
import { useNavigate } from "react-router-dom";

export const useLoginUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: loginUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loggedInUser"] });
      navigate("/");
    },
  });
};
