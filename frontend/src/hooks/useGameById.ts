import { useQuery } from "@tanstack/react-query";
import { fetchGameById } from "../api/games";

export const useGameById = (id: string) => {
  return useQuery({
    queryKey: ["game", id],
    queryFn: () => fetchGameById(id),
    staleTime: 1000 * 60 * 5,
  });
};