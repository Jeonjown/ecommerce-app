import { useMutation } from "@tanstack/react-query";

import type { SignupRequest, SignupResponse } from "../types/api/auth";
import { signupUser } from "../api/authApi";

export const useSignupUser = () => {
  return useMutation<SignupResponse, Error, SignupRequest>({
    mutationFn: signupUser,
  });
};
