import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { searchGames } from "../api/games";

export const useSearchGames = (query: string) => {
  const [debounced, setDebounced] = useState(query);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  return useQuery({
    queryKey: ["search", debounced],
    queryFn: () => searchGames(debounced),
    enabled: debounced.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  });
};
