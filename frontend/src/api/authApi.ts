import type { SignupRequest, SignupResponse } from "../types/api/auth";
import api from "./axios";

export const signupUser = async (
  data: SignupRequest,
): Promise<SignupResponse> => {
  const response = await api.post<SignupResponse>("/auth/signup", data, {
    withCredentials: true,
  });
  return response.data;
};
