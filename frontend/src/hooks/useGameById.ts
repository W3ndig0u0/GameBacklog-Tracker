import { useQuery } from "@tanstack/react-query";
import { fetchGameById, type Game } from "../api/games";

export const useGameById = (id: string) => {
  return useQuery<Game>({
    queryKey: ["game", id],
    queryFn: () => fetchGameById(id),
    staleTime: 1000 * 60 * 5,
  });
};