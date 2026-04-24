import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { CollectionItem } from "../api/library";
import { collectionApi } from "../api/library";

type UpdateFields = Partial<Pick<CollectionItem, "status" | "userRating" | "reviewNotes" | "isFavorite">>;

interface UpdateMutationParams {
  igdbId: string;
  updates: UpdateFields;
}

export const useUpdateCollectionItem = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ igdbId, updates }: UpdateMutationParams) => {
      const token = await getAccessTokenSilently();
      return collectionApi.updateCollectionItem(igdbId, updates, token);
    },
    onSuccess: (updatedItem) => {
      queryClient.setQueryData(["collection"], (oldData: CollectionItem[] | undefined) => {
        if (!oldData) return [];
        return oldData.map((item) =>
          item.igdbId === updatedItem.igdbId ? { ...item, ...updatedItem } : item
        );
      });
      
      queryClient.invalidateQueries({ queryKey: ["collection-status"] });
      toast.success("Collection item updated!");
    },
    onError: () => {
      toast.error("Failed to update collection item.");
    },
  });
};