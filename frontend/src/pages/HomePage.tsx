import { useAuth0 } from "@auth0/auth0-react";
import { useMemo } from "react";
import GameSection from "../components/games/GameSection";
import CallToActionSection from "../components/home/CallToActionSection";
import HeroCarousel from "../components/home/HeroCarousel";
import YourShelf from "../components/home/YourShelf";
import { usePopularGames } from "../hooks/games/usePopularGames";
import { useTopRatedGames } from "../hooks/games/useTopRatedGames";
import { useTrendingGames } from "../hooks/games/useTrendingGames";
import { useGamesLibrary } from "../hooks/library/useCollection";

export default function HomePage() {
  const { user, isAuthenticated, isLoading, error } = useAuth0();
  const trending = useTrendingGames();
  const popular = usePopularGames();
  const topRated = useTopRatedGames();
  const library = useGamesLibrary();

  const featuredGames = useMemo(() => {
    const seen = new Set<number>();

    return [
      ...(trending.data ?? []),
      ...(popular.data ?? []),
      ...(topRated.data ?? []),
    ].filter((game) => {
      if (seen.has(game.id)) return false;
      seen.add(game.id);
      return true;
    });
  }, [popular.data, topRated.data, trending.data]);

  const libraryGames = useMemo(() => library.data ?? [], [library.data]);

  const libraryCount = libraryGames.length;
  const favoritesCount = libraryGames.filter((game) => game.isFavorite).length;
  const playingCount = libraryGames.filter(
    (game) => game.status === "PLAYING",
  ).length;
  const backlogCount = libraryGames.filter(
    (game) => game.status === "BACKLOG",
  ).length;
  const completedCount = libraryGames.filter(
    (game) => game.status === "COMPLETED",
  ).length;
  const droppedCount = libraryGames.filter(
    (game) => game.status === "DROPPED",
  ).length;

  const favoriteGames = useMemo(
    () => libraryGames.filter((game) => game.isFavorite).slice(0, 6),
    [libraryGames],
  );

  const recentlyAdded = useMemo(
    () =>
      [...libraryGames]
        .sort(
          (a, b) =>
            new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
        )
        .slice(0, 4),
    [libraryGames],
  );

  const fetchIsLoading =
    trending.isLoading ||
    popular.isLoading ||
    topRated.isLoading ||
    library.isLoading;

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
    <div className="space-y-12 px-4 py-6 md:px-6 lg:px-8">
      <HeroCarousel
        games={featuredGames}
        userName={user?.given_name || user?.name || undefined}
        isAuthenticated={isAuthenticated}
        libraryCount={libraryCount}
        favoritesCount={favoritesCount}
        playingCount={playingCount}
      />

      {isAuthenticated && libraryCount > 0 && (
        <YourShelf
          libraryCount={libraryCount}
          playingCount={playingCount}
          backlogCount={backlogCount}
          completedCount={completedCount}
          droppedCount={droppedCount}
          favoriteGames={favoriteGames}
          recentlyAdded={recentlyAdded}
        />
      )}

      {!isAuthenticated && <CallToActionSection />}

      <section className="space-y-8 pl-0 md:pl-1">
        <GameSection title="Trending Now" data={trending.data} />
        <GameSection title="Popular Releases" data={popular.data} />
        <GameSection title="Top Rated Gems" data={topRated.data} />
      </section>
    </div>
  );
}
