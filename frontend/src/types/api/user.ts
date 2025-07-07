import type { AuthenticatedUser } from "./auth";

export interface GetLoggedInUserResponse {
  user: AuthenticatedUser;
  message: string;
}
