import type {
  SignupRequest,
  AuthResponse,
  LoginRequest,
} from "../types/api/auth";
import api from "./axios";
import axios from "axios";

export const signupUser = async (
  data: SignupRequest,
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/signup", data, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log(error);

      throw new Error(error.response?.data?.message || "Signup failed");
    }
    throw new Error("Unexpected error");
  }
};

export const loginUser = async (data: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/login", data, {
      withCredentials: true,
    });

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log(error);

      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw new Error("Unexpected error");
  }
};

export const logoutUser = async (): Promise<Omit<AuthResponse, "user">> => {
  try {
    const response = await api.post<AuthResponse>(
      "/auth/logout",
      {},
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log(error);

      throw new Error(error.response?.data?.message || "Logout failed");
    }
    throw new Error("Unexpected error");
  }
};
