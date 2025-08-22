import type { AuthenticatedUser } from "./auth";

export interface GetLoggedInUserResponse {
  user: AuthenticatedUser;
  message: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  created_at: Date;
}

export interface GetUserByIdResponse {
  user: User;
  message: string;
}
