import { useQuery } from "@tanstack/react-query";
import { fetchGameById, type Game } from "../../api/games/games";

export const useGameById = (id: string | undefined) => {
  return useQuery<Game>({
    queryKey: ["game", id],
    queryFn: () => fetchGameById(id!),
    staleTime: 1000 * 60 * 5,
    enabled: !!id && id !== "undefined",
  });
};