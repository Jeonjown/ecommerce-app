import api from "./axios";

import type { GetLoggedInUserResponse } from "../types/api/user";
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
