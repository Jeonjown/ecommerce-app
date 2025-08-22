import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/api/userApi";
import type { GetUserByIdResponse } from "@/types/api/user";

export function useGetUserById(userId: number) {
  return useQuery<GetUserByIdResponse>({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId, // don’t run if no ID
  });
}
