import GameSection from "../components/games/GameSection";
import Search from "../components/Search";
import { usePopularGames } from "../hooks/usePopularGames";
import { useTopRatedGames } from "../hooks/useTopRatedGames";
import { useTrendingGames } from "../hooks/useTrendingGames";

export default function HomePage() {
  const trending = useTrendingGames();
  const popular = usePopularGames();
  const topRated = useTopRatedGames();

  const isLoading =
    trending.isLoading || popular.isLoading || topRated.isLoading;

  if (isLoading) {
    return <div className="p-5 text-white">Loading...</div>;
  }

  return (
    <div className="p-5 space-y-6">
      <h1 className="text-2xl font-bold">JING Game Tracker</h1>

      <Search />

      <GameSection title="Trending" data={trending.data} />
      <GameSection title="Popular" data={popular.data} />
      <GameSection title="Top Rated" data={topRated.data} />
    </div>
  );
}
