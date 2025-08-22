import { demoteUser } from "@/api/userApi";
import type { User } from "@/types/api/user";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useDemoteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => demoteUser(userId),
    onSuccess: (updatedUser: User) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", updatedUser.id] });
    },
  });
};
