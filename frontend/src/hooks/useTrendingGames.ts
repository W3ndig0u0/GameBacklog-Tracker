import { useQuery } from "@tanstack/react-query";
import { fetchTrendingGames } from "../api/games";

export const useTrendingGames = () => {
  return useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrendingGames,
    staleTime: 1000 * 60 * 5,
  });
};