import { getAllUsers } from "@/api/userApi";
import type { User } from "@/types/api/user";
import { useQuery } from "@tanstack/react-query";

export const useGetUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });
};
