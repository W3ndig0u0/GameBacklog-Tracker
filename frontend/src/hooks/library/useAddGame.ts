import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { UserGameApi, type UserGame } from "../../api/library/userGame";

export const useAddGame = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (igdbId: string) => {
      const token = await getAccessTokenSilently();
      return UserGameApi.update(igdbId, { status: "BACKLOG" }, token);
    },
    onMutate: async (igdbId) => {
      await queryClient.cancelQueries({ queryKey: ["library"] });

      const previousLibrary = queryClient.getQueryData<UserGame[]>(["library"]);

      queryClient.setQueryData<UserGame[]>(["library"], (oldData) => {
        if (!oldData) return oldData;

        if (oldData.some((item) => item.igdbId.toString() === igdbId)) {
          return oldData;
        }

        return [
          ...oldData,
          {
            id: `optimistic-${igdbId}`,
            igdbId,
            status: "BACKLOG",
            isFavorite: false,
            addedAt: new Date().toISOString(),
          },
        ];
      });

      return { previousLibrary };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousLibrary) {
        queryClient.setQueryData(["library"], context.previousLibrary);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library"] });
      toast.success("Added to library!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["library"] });
    },
  });
};