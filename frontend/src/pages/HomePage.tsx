import { useAuth0 } from "@auth0/auth0-react";
import { useMemo } from "react";
import { GameCardWrapper } from "../components/games/GameCardWrapper";
import GameSection from "../components/games/GameSection";
import CallToActionSection from "../components/home/CallToActionSection";
import HeroCarousel from "../components/home/HeroCarousel";
import YourShelf from "../components/home/YourShelf";
import { useCollections } from "../hooks/collections/useCollections";
import { useGameById } from "../hooks/games/useGameById";
import { usePopularGames } from "../hooks/games/usePopularGames";
import { useTopRatedGames } from "../hooks/games/useTopRatedGames";
import { useTrendingGames } from "../hooks/games/useTrendingGames";
import { useGamesLibrary } from "../hooks/library/useCollection";
import { useUserLibrary } from "../hooks/users/useUsers";

export default function HomePage() {
  const { user, isAuthenticated, isLoading, error } = useAuth0();
  const trending = useTrendingGames();
  const popular = usePopularGames();
  const topRated = useTopRatedGames();
  const library = useGamesLibrary();
  const { data: collections } = useCollections();
  const collectionAmount = collections?.length ?? 0;
  const targetUserId = user?.sub ?? "";
  const { data: userLibrary } = useUserLibrary(targetUserId);

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
    () => libraryGames.filter((game) => game.isFavorite),
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

  type LibraryItem = {
    id: string;
    igdbId: number;
    status: "PLAYING" | "BACKLOG" | "COMPLETED" | "DROPPED";
    userRating?: number;
    reviewNotes?: string;
    isFavorite?: boolean;
    addedAt: string;
  };

  const userFavoriteGames = useMemo<LibraryItem[]>(() => {
    return (
      userLibrary?.map((item) => ({
        ...item,
        igdbId: Number(item.igdbId),
      })) ?? []
    );
  }, [userLibrary]);

  const randomFavorite = useMemo(() => {
    if (!userFavoriteGames.length) return null;

    return userFavoriteGames[
      // eslint-disable-next-line react-hooks/purity
      Math.floor(Math.random() * userFavoriteGames.length)
    ];
  }, [userFavoriteGames]);

  const randomFavoriteId = randomFavorite?.igdbId ?? null;

  const { data: randomGameData } = useGameById(
    randomFavoriteId ? randomFavoriteId.toString() : "",
  );

  const randomLibraryGame = useMemo(() => {
    if (!libraryGames.length) return null;

    // eslint-disable-next-line react-hooks/purity
    return libraryGames[Math.floor(Math.random() * libraryGames.length)];
  }, [libraryGames]);

  const { data: libraryGameData } = useGameById(
    randomLibraryGame?.igdbId?.toString() ?? "",
  );

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
      <div className="min-h-screen flex items-center justify-center text-blue-500">
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
        collectionAmount={collectionAmount}
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
      {isAuthenticated && favoriteGames.length > 0 && (
        <section className="mb-16 space-y-6 rounded-4xl border border-white/10 bg-white/5 p-5 text-start md:p-8">
          <div className="mb-8 border-b border-zinc-900 pb-3">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs italic font-semibold uppercase tracking-[0.3em] text-purple-400">
                  Personalized For You
                </p>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white md:text-4xl">
                  Recommended Because You Love{" "}
                  <span className="text-purple-400">
                    {randomGameData?.name}
                  </span>
                </h2>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 justify-items-center sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5">
            {randomGameData?.similar_games?.map((game) => (
              <GameCardWrapper key={game.id} igdbId={game.id.toString()} />
            ))}
          </div>
        </section>
      )}

      <GameSection title="Trending Now" data={trending.data} />

      {isAuthenticated && favoriteGames.length > 0 && (
        <section className="mb-16 space-y-6 rounded-4xl border border-white/10 bg-white/5 p-5 text-start md:p-8">
          <div className="mb-8 border-b border-zinc-900 pb-3">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs italic font-semibold uppercase tracking-[0.3em] text-purple-400">
                  Personalized For You
                </p>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white md:text-4xl">
                  Recommended Because You Recently Added{" "}
                  <span className="text-purple-400">
                    {libraryGameData?.name}
                  </span>
                </h2>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 justify-items-center sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5">
            {libraryGameData?.similar_games?.map((game) => (
              <GameCardWrapper key={game.id} igdbId={game.id.toString()} />
            ))}
          </div>
        </section>
      )}

      <GameSection title="Popular Releases" data={popular.data} />

      <GameSection title="Top Rated Gems" data={topRated.data} />
    </div>
  );
}
