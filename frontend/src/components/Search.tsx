import { useState } from "react";
import GameSection from "../components/games/GameSection";
import { useSearchGames } from "../hooks/useSearchGames";

export default function Search() {
  const [query, setQuery] = useState("");

  const { data, isLoading, isError } = useSearchGames(query);

  return (
    <div className="p-5">
      <h3 className="text-white text-lg mb-4">Search Games</h3>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a game..."
        className="p-2 w-72 mb-5 rounded bg-zinc-800 text-white outline-none"
      />

      {isLoading && query && <p className="text-zinc-400">Loading...</p>}
      {isError && <p className="text-red-500">Error loading games</p>}
      {data && <GameSection title="Results" data={data} />}
    </div>
  );
}
