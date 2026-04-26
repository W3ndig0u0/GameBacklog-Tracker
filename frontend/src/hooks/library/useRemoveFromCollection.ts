import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserGameApi, type UserGame } from "../../api/library/userGame";

export const useRemoveFromCollection = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (igdbId: string) => {
      const token = await getAccessTokenSilently();
      return UserGameApi.remove(igdbId, token);
    },
    onMutate: async (igdbId: string) => {
      await queryClient.cancelQueries({ queryKey: ["library"] });

      const previous = queryClient.getQueryData<UserGame[]>(["library"]);

      queryClient.setQueryData<UserGame[]>(["library"], (old) =>
        old?.filter((game) => game.igdbId.toString() !== igdbId) ?? [],
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["library"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["library"] });
    },
  });
};