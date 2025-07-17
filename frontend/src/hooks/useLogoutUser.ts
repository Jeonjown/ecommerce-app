import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export const useLogoutUser = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      //  clear the logged-in user data
      queryClient.setQueryData(["loggedInUser"], null);
      navigate("/login");
    },
  });
};
