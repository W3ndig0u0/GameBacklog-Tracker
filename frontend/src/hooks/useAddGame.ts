import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { collectionApi } from "../api/collection";

export const useAddGame = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gameId: string) => {
      const token = await getAccessTokenSilently();
      return collectionApi.addToCollection(gameId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collection"] });
      toast.success("Added to collection!");
    },
    onError: () => {
      toast.error("Failed to add to collection");
    }
  });
};