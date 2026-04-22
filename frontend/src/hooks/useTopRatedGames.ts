import { useQuery } from "@tanstack/react-query";
import { fetchTopRatedGames } from "../api/games";

export const useTopRatedGames = () => {
  return useQuery({
    queryKey: ["topRated"],
    queryFn: fetchTopRatedGames,
    staleTime: 1000 * 60 * 5,
  });
};