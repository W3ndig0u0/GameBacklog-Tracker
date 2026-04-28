import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { UserGame } from "../../api/library/userGame";
import { UserGameApi } from "../../api/library/userGame";

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
    onMutate: async ({ igdbId, updates }) => {
      await queryClient.cancelQueries({ queryKey: ["library"] });

      const previousLibrary = queryClient.getQueryData<UserGame[]>(["library"]);

      queryClient.setQueryData<UserGame[]>(["library"], (oldData) =>
        oldData?.map((item) =>
          item.igdbId.toString() === igdbId
            ? { ...item, ...updates }
            : item,
        ),
      );

      return { previousLibrary };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousLibrary) {
        queryClient.setQueryData(["library"], context.previousLibrary);
      }
    },
    onSuccess: (updatedItem: UserGame) => {
      queryClient.setQueryData<UserGame[]>(["library"], (oldData) => {
        if (!oldData) return oldData;

        return oldData.map((item) =>
          item.igdbId.toString() === updatedItem.igdbId.toString()
            ? { ...item, ...updatedItem }
            : item,
        );
      });
      toast.success("Collection item updated!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["library"] });
    },
  });
};