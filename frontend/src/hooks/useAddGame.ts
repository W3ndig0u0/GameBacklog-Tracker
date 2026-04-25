import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { UserGameApi } from "../api/userGame";

export const useAddGame = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (igdbId: string) => {
      const token = await getAccessTokenSilently();

      return UserGameApi.update(igdbId, { status: "BACKLOG" }, token);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library"] });
      toast.success("Added to library!");
    },

    onError: () => {
      toast.error("Failed to add game");
    },
  });
};
