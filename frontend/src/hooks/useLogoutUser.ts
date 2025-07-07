import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export const useLogoutUser = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["loggedInUser"],
      });

      navigate("/login");
    },
  });
};
