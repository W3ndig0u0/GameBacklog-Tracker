import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { Collection } from "../api/collections/collections";
import { GameCardWrapper } from "../components/games/GameCardWrapper";
import { useCollectionGameIds } from "../hooks/collections/useCollections";
import {
  useUserCollections,
  useUserHistory,
  useUserLibrary,
  useUserProfile,
  useUserReviews,
} from "../hooks/users/useUsers";

const formatDate = (value?: string | null) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString();
};

const formatTimeAgo = (dateString: string) => {
  if (!dateString) return "just now";

  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const { label, seconds } of intervals) {
    const value = Math.floor(diffInSeconds / seconds);
    if (value >= 1) {
      return rtf.format(-value, label as Intl.RelativeTimeFormatUnit);
    }
  }

  return "just now";
};

const ProfileSection = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) => (
  <section className="mt-12">
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-black uppercase italic tracking-tighter text-white md:text-2xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm font-medium italic text-zinc-400">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
    {children}
  </section>
);

const CollectionShelf = ({ collection }: { collection: Collection }) => {
  const { data: gameIds, isLoading } = useCollectionGameIds(collection.id);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white">{collection.name}</h3>
          {collection.description ? (
            <p className="mt-1 text-sm text-zinc-400">
              {collection.description}
            </p>
          ) : null}
        </div>
        <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-200">
          {gameIds?.length ?? 0} games
        </span>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
          Loading games...
        </div>
      ) : gameIds && gameIds.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {gameIds.map((igdbId) => (
            <GameCardWrapper
              key={`${collection.id}-${igdbId}`}
              igdbId={igdbId.toString()}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
          No games in this collection yet.
        </div>
      )}
    </div>
  );
};

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

  const favoriteGames = (library ?? []).filter((item) => item.isFavorite);
  const displayName =
    profile?.displayName || user?.name || targetUserId || "Player";
  const avatar =
    profile?.pictureUrl || (viewingOwnProfile ? user?.picture : "");

  return (
    <div className="min-h-screen pb-20 font-sans text-white">
      <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-zinc-900 md:h-64">
        {avatar ? (
          <img
            src={avatar}
            alt="Profile Banner"
            className="h-full w-full object-cover opacity-60"
          />
        ) : null}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#09090b]/40 to-[#09090b]" />
      </div>

      <div className="relative z-10 mx-auto -mt-16 max-w-6xl px-6">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="relative group">
            {avatar ? (
              <img
                src={avatar}
                alt={displayName}
                className="h-32 w-32 rounded-full border-4 border-[#09090b] object-cover shadow-[0_0_20px_rgba(170,59,255,0.2)] md:h-40 md:w-40"
              />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-[#09090b] bg-zinc-800 text-4xl font-black text-white md:h-40 md:w-40">
                {displayName.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-accent opacity-20 blur-xl transition-all duration-300 group-hover:opacity-40" />
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-wide text-white md:text-3xl">
            {displayName}
          </h1>
          {profile?.email && viewingOwnProfile ? (
            <p className="mt-1 text-sm font-medium text-zinc-400">
              {profile.email}
            </p>
          ) : null}

          <div className="mt-6 grid w-full max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Reviews
              </div>
              <div className="mt-2 text-2xl font-black">
                {profile?.reviewCount ?? 0}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Collections
              </div>
              <div className="mt-2 text-2xl font-black">
                {profile?.collectionCount ?? 0}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Library
              </div>
              <div className="mt-2 text-2xl font-black">
                {profile?.libraryCount ?? 0}
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Favorites
              </div>
              <div className="mt-2 text-2xl font-black">
                {profile?.favoriteCount ?? 0}
              </div>
            </div>
          </div>

          {profile?.createdAt ? (
            <p className="mt-4 text-sm text-zinc-500">
              Joined {formatDate(profile.createdAt)}
            </p>
          ) : null}
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
                <div
                  key={item.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-2"
                >
                  <GameCardWrapper igdbId={item.igdbId.toString()} />
                </div>
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
                <div
                  key={item.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-2"
                >
                  <GameCardWrapper igdbId={item.igdbId.toString()} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-800 p-16 text-center text-zinc-500">
              No favorite games yet.
            </div>
          )}
        </ProfileSection>

        <ProfileSection title="History" subtitle="Recent public game clicks">
          {history && history.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-2"
                >
                  <GameCardWrapper igdbId={item.igdbId.toString()} />
                  <div className="px-1 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                    {formatTimeAgo(item.clickedAt)}
                  </div>
                </div>
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
                    <div className="text-yellow-400 text-sm tracking-widest">
                      {"★".repeat(Math.max(1, Math.min(5, review.starRating)))}
                      {"☆".repeat(
                        5 - Math.max(1, Math.min(5, review.starRating)),
                      )}
                    </div>
                    <Link
                      to="/game/$gameId"
                      params={{ gameId: review.igdbId.toString() }}
                      className="text-xs font-bold uppercase tracking-widest text-purple-400 hover:text-purple-300"
                    >
                      Open game
                    </Link>
                  </div>
                  <p className="whitespace-pre-wrap text-lg leading-relaxed text-zinc-300">
                    {review.reviewText}
                  </p>
                  <div className="mt-3 text-xs italic text-zinc-500">
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
