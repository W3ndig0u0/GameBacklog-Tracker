import { useAuth0 } from "@auth0/auth0-react";
import GameSection from "../components/games/GameSection";
import LoginButton from "../components/Login";
import LogoutButton from "../components/Logout";
import Search from "../components/Search";
import { usePopularGames } from "../hooks/usePopularGames";
import { useTopRatedGames } from "../hooks/useTopRatedGames";
import { useTrendingGames } from "../hooks/useTrendingGames";

export default function HomePage() {
  const trending = useTrendingGames();
  const popular = usePopularGames();
  const topRated = useTopRatedGames();
  const { isAuthenticated, isLoading, error } = useAuth0();

  const fetchIsLoading =
    trending.isLoading || popular.isLoading || topRated.isLoading;

  if (fetchIsLoading) {
    return <div className="p-5 text-white">Loading...</div>;
  }

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="loading-state">
          <div className="loading-text">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error-state">
          <div className="error-title">Oops!</div>
          <div className="error-message">Something went wrong</div>
          <div className="error-sub-message">{error.message}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1 className="text-2xl font-bold">JING Game Tracker</h1>
      <div className="main-card-wrapper">
        {isAuthenticated ? <LogoutButton /> : <LoginButton />}
      </div>

      <div className="p-5 space-y-6">
        <Search />

        <GameSection title="Trending" data={trending.data} />
        <GameSection title="Popular" data={popular.data} />
        <GameSection title="Top Rated" data={topRated.data} />
      </div>
    </div>
  );
}
