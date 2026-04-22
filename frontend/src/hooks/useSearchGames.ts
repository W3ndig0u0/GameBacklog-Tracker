import { useQuery } from "@tanstack/react-query";
import { searchGames } from "../api/games";

export const useSearchGames = (query: string) => {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchGames(query),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  });
};