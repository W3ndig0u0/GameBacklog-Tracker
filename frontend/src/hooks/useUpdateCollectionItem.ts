import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { UserGame } from "../api/userGame";
import { UserGameApi } from "../api/userGame";

type UpdateFields = Partial<
  Pick<UserGame, "status" | "userRating" | "reviewNotes" | "isFavorite">
>;

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
      return UserGameApi.update(igdbId, updates, token);
    },

    onSuccess: (updatedItem: UserGame) => {
      queryClient.setQueryData<UserGame[]>(["library"], (oldData) => {
        if (!oldData) return [];

        return oldData.map((item) =>
          item.igdbId === updatedItem.igdbId
            ? { ...item, ...updatedItem }
            : item,
        );
      });

      toast.success("Collection item updated!");
    },

    onError: () => {
      toast.error("Failed to update collection item.");
    },
  });
};
