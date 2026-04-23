import { useAuth0 } from "@auth0/auth0-react";
import GameSection from "../components/games/GameSection";
import Search from "../components/Search";
import { usePopularGames } from "../hooks/usePopularGames";
import { useTopRatedGames } from "../hooks/useTopRatedGames";
import { useTrendingGames } from "../hooks/useTrendingGames";

export default function HomePage() {
  const trending = useTrendingGames();
  const popular = usePopularGames();
  const topRated = useTopRatedGames();
  const { isLoading, error } = useAuth0(); // Vi behåller dessa för felhantering

  const fetchIsLoading =
    trending.isLoading || popular.isLoading || topRated.isLoading;

  if (fetchIsLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-purple-500">
        <span className="animate-pulse text-xl font-semibold">
          Loading games...
        </span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-blue-500">
        <span className="animate-pulse text-xl font-semibold">
          Loading User data...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center bg-red-950/50 p-6 rounded-lg border border-red-500/50">
          <h2 className="text-red-400 text-xl font-bold mb-2">Oops!</h2>
          <p className="text-zinc-300">
            Something went wrong with authentication.
          </p>
          <p className="text-zinc-500 text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="px-4">
        <Search />
      </section>

      <section className="space-y-8 pl-4">
        <GameSection title="Trending Now" data={trending.data} />
        <GameSection title="Popular Releases" data={popular.data} />
        <GameSection title="Top Rated Gems" data={topRated.data} />
      </section>
    </div>
  );
}
