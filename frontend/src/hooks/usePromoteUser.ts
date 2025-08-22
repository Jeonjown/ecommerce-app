import { promoteUser } from "@/api/userApi";
import type { User } from "@/types/api/user";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const usePromoteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => promoteUser(userId),
    onSuccess: (updatedUser: User) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", updatedUser.id] });
    },
  });
};
