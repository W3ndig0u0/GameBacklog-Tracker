import { useAuth0 } from "@auth0/auth0-react";
import GameSection from "../components/games/GameSection";
import { usePopularGames } from "../hooks/games/usePopularGames";
import { useTopRatedGames } from "../hooks/games/useTopRatedGames";
import { useTrendingGames } from "../hooks/games/useTrendingGames";

export default function HomePage() {
  const trending = useTrendingGames();
  const popular = usePopularGames();
  const topRated = useTopRatedGames();
  const { isLoading, error } = useAuth0();

  const fetchIsLoading =
    trending.isLoading || popular.isLoading || topRated.isLoading;

  if (fetchIsLoading) {
    return (
      <span className="animate-pulse text-xl font-semibold">
        Loading games...
      </span>
    );
  }

  if (isLoading) {
    return (
      <span className="animate-pulse text-xl font-semibold">
        Loading User data...
      </span>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-blue-500">
        <span className="animate-pulse text-xl font-semibold">
          Something went wrong while loading user data. Please try again later.
          The error message is:
          {error.message}
        </span>
      </div>
    );
  }

  return (
    <div>
      <section className="space-y-8 pl-4 mt-10">
        <GameSection title="Trending Now" data={trending.data} />
        <GameSection title="Popular Releases" data={popular.data} />
        <GameSection title="Top Rated Gems" data={topRated.data} />
      </section>
    </div>
  );
}
