import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const useSearchGames = (query: string) => {
  const [debounced, setDebounced] = useState(query);

useEffect(() => {
  const t = setTimeout(() => setDebounced(query), 400);
  return () => clearTimeout(t);
}, [query]);

  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchGames(query),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 5,
  });
};