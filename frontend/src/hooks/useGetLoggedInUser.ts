import { useQuery } from "@tanstack/react-query";
import { getLoggedInUser } from "../api/userApi";
import type { GetLoggedInUserResponse } from "../types/api/user";

export const useGetLoggedInUser = () => {
  return useQuery<GetLoggedInUserResponse>({
    queryKey: ["loggedInUser"],
    queryFn: getLoggedInUser,
    retry: false,
    refetchOnWindowFocus: false,
  });
};
