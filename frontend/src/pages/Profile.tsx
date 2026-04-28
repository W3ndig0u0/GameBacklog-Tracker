import { useAuth0 } from "@auth0/auth0-react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { fetchGameById, type Game } from "../api/games/games";
import { GameCardWrapper } from "../components/games/GameCardWrapper";
import {
  useUserCollections,
  useUserHistory,
  useUserLibrary,
  useUserProfile,
  useUserReviews,
} from "../hooks/users/useUsers";

import {
  CollectionShelf,
  GameCardShell,
  ProfileSection,
  StatCard,
  TagChip,
} from "./profileParts/ProfileComponents";

import {
  formatDate,
  formatTimeAgo,
  STATUS_COLORS,
} from "./profileParts/profileUtils";

export default function Profile() {
  const { user, isLoading: isAuthLoading } = useAuth0();
  const profileUserId =
    new URLSearchParams(window.location.search).get("userId") ?? undefined;
  const targetUserId = profileUserId ?? user?.sub ?? "";
  const viewingOwnProfile =
    (!profileUserId && !!user?.sub) || profileUserId === user?.sub;

  const { data: profile, isLoading: isProfileLoading } =
    useUserProfile(targetUserId);
  const { data: collections, isLoading: isCollectionsLoading } =
    useUserCollections(targetUserId);
  const { data: reviews, isLoading: isReviewsLoading } =
    useUserReviews(targetUserId);
  const { data: history, isLoading: isHistoryLoading } =
    useUserHistory(targetUserId);
  const { data: library, isLoading: isLibraryLoading } =
    useUserLibrary(targetUserId);

  const sortedLibrary = useMemo(
    () =>
      [...(library ?? [])].sort((a, b) => {
        if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      }),
    [library],
  );

  const statusCounts = useMemo(
    () =>
      sortedLibrary.reduce(
        (accumulator, item) => {
          const status = item.status as keyof typeof STATUS_COLORS;
          accumulator[status] += 1;
          return accumulator;
        },
        { PLAYING: 0, BACKLOG: 0, COMPLETED: 0, DROPPED: 0 },
      ),
    [sortedLibrary],
  );

  const favoriteGames = sortedLibrary.filter((item) => item.isFavorite);
  const totalGames = sortedLibrary.length;
  const completedCount = statusCounts.COMPLETED;
  const backlogCount = statusCounts.BACKLOG;
  const playingCount = statusCounts.PLAYING;
  const droppedCount = statusCounts.DROPPED;
  const completedPercent = totalGames
    ? Math.round((completedCount / totalGames) * 100)
    : 0;
  const completionRate = totalGames
    ? Math.round(((completedCount + playingCount) / totalGames) * 100)
    : 0;

  const bannerGameId =
    favoriteGames[0]?.igdbId ??
    sortedLibrary[0]?.igdbId ??
    history?.[0]?.igdbId;

  const { data: bannerGame } = useQuery<Game>({
    queryKey: ["profile", targetUserId, "banner", bannerGameId],
    enabled: !!bannerGameId,
    queryFn: async () => fetchGameById(String(bannerGameId)),
    staleTime: 1000 * 60 * 10,
  });

  const tagIds = useMemo(
    () => sortedLibrary.slice(0, 12).map((item) => item.igdbId.toString()),
    [sortedLibrary],
  );

  const tagQueries = useQueries({
    queries: tagIds.map((gameId) => ({
      queryKey: ["profile", targetUserId, "tags", gameId],
      queryFn: async () => fetchGameById(gameId),
      enabled: !!gameId,
      staleTime: 1000 * 60 * 30,
    })),
  });

  const tagGames = tagQueries
    .map((result) => result.data)
    .filter(Boolean) as Game[];

  const reviewGameIds = useMemo(
    () =>
      Array.from(
        new Set((reviews ?? []).map((review) => review.igdbId.toString())),
      ),
    [reviews],
  );

  const reviewGameQueries = useQueries({
    queries: reviewGameIds.map((gameId) => ({
      queryKey: ["profile", targetUserId, "review-game", gameId],
      queryFn: async () => fetchGameById(gameId),
      enabled: !!gameId,
      staleTime: 1000 * 60 * 30,
    })),
  });

  const reviewGamesById = reviewGameIds.reduce<
    Record<string, Game | undefined>
  >((accumulator, gameId, index) => {
    accumulator[gameId] = reviewGameQueries[index]?.data;
    return accumulator;
  }, {});

  const favoriteTags = useMemo(() => {
    const counts = new Map<string, number>();

    for (const game of tagGames) {
      const tags = [...(game.genres ?? []), ...(game.themes ?? [])];
      for (const tag of tags) {
        counts.set(tag.name, (counts.get(tag.name) ?? 0) + 1);
      }
    }

    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
      .slice(0, 6);
  }, [tagGames]);

  const loading =
    (!profileUserId && isAuthLoading) ||
    isProfileLoading ||
    isCollectionsLoading ||
    isReviewsLoading ||
    isHistoryLoading ||
    isLibraryLoading;

  if (!targetUserId && !isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-zinc-300">
        <p>Please log in or open a profile link to view profile data.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-accent">
        <span className="animate-pulse text-lg font-semibold">
          Loading profile...
        </span>
      </div>
    );
  }

  const displayName =
    profile?.displayName || user?.name || targetUserId || "Player";
  const avatar =
    profile?.pictureUrl || (viewingOwnProfile ? user?.picture : "");
  const bannerImage = bannerGame?.cover?.url
    ? `https:${bannerGame.cover.url.replace("t_thumb", "t_1080p")}`
    : bannerGame?.screenshots?.[0]?.url
      ? `https:${bannerGame.screenshots[0].url.replace("t_thumb", "t_1080p")}`
      : bannerGame?.artworks?.[0]?.url
        ? `https:${bannerGame.artworks[0].url.replace("t_thumb", "t_1080p")}`
        : "";

  return (
    <div className="min-h-screen pb-20 font-sans text-white">
      <div className="relative h-56 w-full overflow-hidden rounded-3xl bg-zinc-900 md:h-96">
        <img
          src={bannerImage}
          alt="Profile Banner"
          className="h-full w-full object-cover object-top-mid opacity-75"
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#09090b]/40 to-[#09090b]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(52,211,153,0.18),transparent_25%),radial-gradient(circle_at_80%_20%,rgba(96,165,250,0.18),transparent_25%),radial-gradient(circle_at_50%_80%,rgba(168,85,247,0.16),transparent_30%)]" />
      </div>

      <div className="relative z-10 mx-auto -mt-16 max-w-6xl px-6">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="relative group">
            <img
              src={avatar}
              alt={displayName}
              className="h-32 w-32 rounded-full border-4 border-[#09090b] object-cover shadow-[0_0_20px_rgba(170,59,255,0.2)]"
            />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-wide text-white md:text-3xl">
            {displayName}
          </h1>
          <p className="mt-1 text-sm font-medium text-zinc-400">
            {profile?.email}
          </p>
          <p className="mt-4 text-sm text-zinc-500">
            Joined {formatDate(profile?.createdAt)}
          </p>
          <div className="mt-6 grid w-full max-w-5xl gap-3 md:grid-cols-3">
            <StatCard
              label="Library"
              value={String(totalGames).padStart(2, "0")}
              subtitle="All public games"
              className="border-blue-400/20 bg-linear-to-br from-blue-400/10 to-transparent hover:border-blue-400/50 hover:bg-blue-400/15"
              valueClassName="text-blue-400"
            />
            <StatCard
              label="Favorites"
              value={String(favoriteGames.length).padStart(2, "0")}
              subtitle="Liked games"
              className="border-emerald-400/20 bg-linear-to-br from-emerald-400/10 to-transparent hover:border-emerald-400/50 hover:bg-emerald-400/15"
              valueClassName="text-emerald-400"
            />
            <StatCard
              label="Progress"
              value={`${completedPercent}%`}
              subtitle={`${completedCount} done · ${backlogCount} left`}
              className="border-purple-400/20 bg-linear-to-br from-purple-400/10 to-transparent hover:border-purple-400/50 hover:bg-purple-400/15"
              valueClassName="text-purple-400"
            />
          </div>
          <div className="mt-4 grid w-full max-w-5xl grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard
              label="Reviews"
              value={String(profile?.reviewCount ?? 0).padStart(2, "0")}
              subtitle="Public reviews"
              className="border-blue-400/20 hover:border-blue-400/50 hover:bg-blue-400/10"
              valueClassName="text-blue-400"
            />
            <StatCard
              label="Collections"
              value={String(profile?.collectionCount ?? 0).padStart(2, "0")}
              subtitle="Public lists"
              className="border-emerald-400/20 hover:border-emerald-400/50 hover:bg-emerald-400/10"
              valueClassName="text-emerald-400"
            />
            <StatCard
              label="Playing"
              value={String(playingCount).padStart(2, "0")}
              subtitle={`Completion rate ${completionRate}%`}
              className="border-purple-400/20 hover:border-purple-400/50 hover:bg-purple-400/10"
              valueClassName="text-purple-400"
            />
            <StatCard
              label="Dropped"
              value={String(droppedCount).padStart(2, "0")}
              subtitle="Left behind"
              className="border-red-400/20 hover:border-red-400/50 hover:bg-red-400/10"
              valueClassName="text-red-400"
            />
          </div>
        </div>

        <ProfileSection
          title="Collections"
          subtitle="Public lists and the games inside them"
        >
          {collections && collections.length > 0 ? (
            <div className="space-y-6">
              {collections.map((collection) => (
                <CollectionShelf key={collection.id} collection={collection} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-800 p-16 text-center text-zinc-500">
              No public collections yet.
            </div>
          )}
        </ProfileSection>

        <ProfileSection
          title="Library"
          subtitle="All public games in this user's library"
        >
          {library && library.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {library.map((item) => (
                <GameCardWrapper igdbId={item.igdbId.toString()} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-800 p-16 text-center text-zinc-500">
              No public library items yet.
            </div>
          )}
        </ProfileSection>

        <ProfileSection
          title="Favorite Games"
          subtitle="Public favorites pulled from the library"
        >
          {favoriteGames.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {favoriteGames.map((item) => (
                <GameCardWrapper igdbId={item.igdbId.toString()} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-800 p-16 text-center text-zinc-500">
              No favorite games yet.
            </div>
          )}
        </ProfileSection>

        <ProfileSection
          title="Favorite Tags"
          subtitle="Genres and themes from their public library"
        >
          {favoriteTags.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteTags.map((tag, index) => {
                const accent =
                  index % 4 === 0
                    ? "border-blue-400/20 bg-blue-400/10 text-blue-300"
                    : index % 4 === 1
                      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                      : index % 4 === 2
                        ? "border-purple-400/20 bg-purple-400/10 text-purple-300"
                        : "border-red-400/20 bg-red-400/10 text-red-300";

                return (
                  <TagChip
                    key={tag.name}
                    name={tag.name}
                    count={tag.count}
                    accent={accent}
                  />
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-800 p-16 text-center text-zinc-500">
              No tag data available yet.
            </div>
          )}
        </ProfileSection>

        <ProfileSection
          title="Status Graph"
          subtitle="How this library is split right now"
        >
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6">
            <div className="space-y-4">
              {(
                Object.entries(STATUS_COLORS) as Array<
                  [
                    keyof typeof STATUS_COLORS,
                    (typeof STATUS_COLORS)[keyof typeof STATUS_COLORS],
                  ]
                >
              ).map(([status, config]) => {
                const count = statusCounts[status];
                const percent = totalGames
                  ? Math.round((count / totalGames) * 100)
                  : 0;

                return (
                  <div key={status} className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span className={config.accent}>{config.label}</span>
                      <span className="text-zinc-300">
                        {count} games · {percent}%
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-zinc-900/80">
                      <div
                        className={`h-full rounded-full ${config.bar}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ProfileSection>

        <ProfileSection title="History" subtitle="Recent public game clicks">
          {history && history.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {history.map((item) => (
                <GameCardShell key={item.id}>
                  <GameCardWrapper igdbId={item.igdbId.toString()} />
                  <div className="px-1 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                    {formatTimeAgo(item.clickedAt)}
                  </div>
                </GameCardShell>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-800 p-16 text-center text-zinc-500">
              No public history yet.
            </div>
          )}
        </ProfileSection>

        <ProfileSection
          title="Reviews"
          subtitle="Public reviews written by this user"
        >
          {reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div className="text-sm tracking-widest text-yellow-400">
                      {"★".repeat(Math.max(1, Math.min(5, review.starRating)))}
                      {"☆".repeat(
                        5 - Math.max(1, Math.min(5, review.starRating)),
                      )}
                    </div>
                    <div className="mb-3 inline-flex items-center rounded-full border border-purple-700/20 bg-purple-800/10 px-3 py-1 text-start text-[11px] font-bold uppercase tracking-widest text-purple-400">
                      {reviewGamesById[review.igdbId.toString()]?.name ??
                        `Game #${review.igdbId}`}
                    </div>
                    <Link
                      to="/game/$gameId"
                      params={{ gameId: review.igdbId.toString() }}
                      className="text-xs font-bold uppercase tracking-widest text-purple-400 hover:text-purple-300"
                    >
                      Open game
                    </Link>
                  </div>
                  <p className="flex-1 border-l-4 border-purple-500 py-1 pl-4 text-start text-lg leading-relaxed whitespace-pre-wrap italic text-zinc-300">
                    {review.reviewText}
                  </p>
                  <div className="mt-3 text-start text-xs italic text-zinc-500">
                    {formatDate(review.updatedAt ?? review.reviewedAt)}
                    {review.updatedAt ? " (edited)" : ""}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-800 p-16 text-center text-zinc-500">
              No public reviews yet.
            </div>
          )}
        </ProfileSection>
      </div>
    </div>
  );
}
