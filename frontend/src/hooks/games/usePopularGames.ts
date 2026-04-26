import { useQuery } from "@tanstack/react-query";
import { fetchPopularGames } from "../../api/games/games";

export const usePopularGames = () => {
  return useQuery({
    queryKey: ["popular"],
    queryFn: fetchPopularGames,
    staleTime: 1000 * 60 * 5,
  });
};