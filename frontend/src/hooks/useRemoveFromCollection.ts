import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { collectionApi } from "../api/collection";

export const useRemoveFromCollection = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (igdbId: string) => {
      const token = await getAccessTokenSilently();
      return collectionApi.removeFromCollection(igdbId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collection"] });
      toast.success("Removed from collection!");
    },

    onError: () => {
      toast.error("Failed to remove from collection");
    }
  });
};