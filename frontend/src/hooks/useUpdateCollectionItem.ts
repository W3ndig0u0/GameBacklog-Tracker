import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CollectionItem } from "../api/collection";
import { collectionApi } from "../api/collection";

type UpdateFields = Partial<Pick<CollectionItem, "status" | "user_rating" | "review_notes">>;

interface UpdateMutationParams {
  igdbId: number;
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collection"] });
    },
  });
};