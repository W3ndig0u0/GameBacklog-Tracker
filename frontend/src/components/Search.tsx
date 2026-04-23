import { useState } from "react";
import GameSection from "../components/games/GameSection";
import { useSearchGames } from "../hooks/useSearchGames";

export default function Search() {
  const [query, setQuery] = useState("");
  const { data, isLoading, isError } = useSearchGames(query);

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto">
      <h3 className="text-white text-2xl md:text-4xl font-black uppercase italic tracking-tighter mb-6 md:mb-10">
        Search Games
      </h3>

      <div className="relative mb-10">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a game..."
          className="
            w-full md:w-96 
            p-4 
            rounded-xl 
            bg-zinc-900/50 
            border border-white/5 
            text-white 
            outline-none 
            focus:border-accent/50 
            transition-all 
            backdrop-blur-md
            placeholder:text-zinc-600
          "
        />
      </div>

      <div className="min-h-[2rem]">
        {isLoading && query && (
          <p className="text-accent animate-pulse font-bold uppercase text-xs tracking-widest">
            Searching...
          </p>
        )}
        {isError && (
          <p className="text-red-500 font-bold uppercase text-xs">
            Error loading games
          </p>
        )}
      </div>

      {data && (
        <div className="mt-4">
          <GameSection title="Results" data={data} />
        </div>
      )}
    </div>
  );
}
