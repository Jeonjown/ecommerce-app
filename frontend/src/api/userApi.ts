import api from "./axios";

import type {
  GetLoggedInUserResponse,
  GetUserByIdResponse,
  User,
} from "../types/api/user";
import { isAxiosError } from "axios";

export const getLoggedInUser = async (): Promise<GetLoggedInUserResponse> => {
  try {
    const response = await api.get("/users/me", { withCredentials: true });
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch logged-in user.",
      );
    }
    throw new Error("Unexpected error fetching logged-in user.");
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get<User[]>("/users", { withCredentials: true });
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch users.",
      );
    }
    throw new Error("Unexpected error fetching users.");
  }
};

export const getUserById = async (
  userId: number,
): Promise<GetUserByIdResponse> => {
  try {
    const response = await api.get<GetUserByIdResponse>(`/users/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user details.",
      );
    }
    throw new Error("Unexpected error fetching user details.");
  }
};
export const promoteUser = async (userId: number): Promise<User> => {
  try {
    const response = await api.patch<User>(
      `/users/${userId}/promote`,
      {},
      { withCredentials: true },
    );
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to promote user.",
      );
    }
    throw new Error("Unexpected error promoting user.");
  }
};

export const demoteUser = async (userId: number): Promise<User> => {
  try {
    const response = await api.patch<User>(
      `/users/${userId}/demote`,
      {},
      { withCredentials: true },
    );
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to demote user.",
      );
    }
    throw new Error("Unexpected error demoting user.");
  }
};
