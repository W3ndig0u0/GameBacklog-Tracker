import GameSection from "../components/games/GameSection";
import Search from "../components/Search";
import { usePopularGames } from "../hooks/usePopularGames";
import { useTopRatedGames } from "../hooks/useTopRatedGames";
import { useTrendingGames } from "../hooks/useTrendingGames";

export default function HomePage() {
  const trending = useTrendingGames();
  const popular = usePopularGames();
  const topRated = useTopRatedGames();

  if (trending.isLoading || popular.isLoading || topRated.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>JING Game Tracker</h1>
      <Search />
      <GameSection title="Trending" data={trending.data} />
      <GameSection title="Popular" data={popular.data} />
      <GameSection title="Top Rated" data={topRated.data} />
    </div>
  );
}
