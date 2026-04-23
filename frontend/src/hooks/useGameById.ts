import { useQuery } from "@tanstack/react-query";
import { fetchPopularGames } from "../api/games";

export const useGameById = (id: string) => {
  return useQuery({
    queryKey: ["game", id],
    queryFn: () => fetchPopularGames(),
    staleTime: 1000 * 60 * 5,
  });
};