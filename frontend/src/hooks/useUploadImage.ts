import { uploadImage } from "@/api/imageApi";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUploadImage = () => {
  const queryClient = useQueryClient();

  return useMutation<File, Error, File>({
    mutationFn: uploadImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });
};
