import { useAuth0 } from "@auth0/auth0-react";
import { AlertCircle, Loader2, Search as SearchIcon } from "lucide-react";
import { useDeferredValue, useState } from "react";
import GameSection from "../components/games/GameSection";
import { useSearchGames } from "../hooks/useSearchGames";

export default function Search() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const { user } = useAuth0();
  const { data, isLoading, isError } = useSearchGames(deferredQuery);

  return (
    <div className="min-h-screen bg-transparent px-4 py-8 md:px-10 lg:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="space-y-1">
            <h3 className="text-white md:text-4xl font-black uppercase italic">
              {user?.given_name || user?.name || "Player"} Search
            </h3>
            <p className="text-zinc-500 text-sm font-medium uppercase tracking-[0.2em]">
              Discover your next adventure
            </p>
          </div>

          <div className="relative group w-full md:w-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <SearchIcon className="w-5 h-5 text-zinc-500 group-focus-within:text-[#a855f7] transition-colors" />
            </div>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a title..."
              className="
                w-full md:w-100 lg:w-125
                py-4 pl-4 pr-16
                rounded-2xl 
                bg-[#a855f7]/5 
                border border-[#a855f7]/20 
                outline-none 
                focus:bg-[#a855f7]/10
                focus:border-[#a855f7]/60 
                focus:shadow-[0_0_30px_rgba(168,85,247,0.15)]
                transition-all duration-300
                backdrop-blur-xl
                placeholder:text-zinc-600
              "
            />
          </div>
        </div>

        <div className="mb-8 flex items-center gap-4 min-h-8">
          {isLoading && query && (
            <div className="flex items-center gap-2 text-[#a855f7] font-medium text-sm animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching database...
            </div>
          )}

          {isError && (
            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-2 rounded-xl border border-red-400/20 text-xs font-bold uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" />
              API connection failed
            </div>
          )}
        </div>

        <div className="relative">
          {data && data.length > 0 ? (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 ease-out">
              <GameSection
                title={query ? `Results for "${query}"` : "Trending"}
                data={data}
              />
            </div>
          ) : query && !isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-[#a855f7]/10 rounded-full flex items-center justify-center mb-6 border border-[#a855f7]/20">
                <SearchIcon className="w-10 h-10 text-zinc-700" />
              </div>
              <h4 className="text-white text-xl font-bold mb-2">
                No matches found
              </h4>
              <p className="text-zinc-500 max-w-xs mx-auto">
                We couldn't find any games matching "{query}".
              </p>
            </div>
          ) : (
            <div className="border-2 border-dashed border-zinc-800 rounded-3xl py-50 flex flex-col items-center justify-center">
              <p className="text-zinc-600 font-medium tracking-widest uppercase text-sm">
                Start typing to explore
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
