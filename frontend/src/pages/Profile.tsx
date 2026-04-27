import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  useMyGameHistory,
  useMyProfile,
  useUserProfile,
} from "../hooks/users/useUsers";

const formatDate = (value?: string | null) => {
  if (!value) return "";
  return new Date(value).toLocaleDateString();
};

export default function Profile() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth0();
  const profileUserId = useMemo(
    () =>
      new URLSearchParams(window.location.search).get("userId") ?? undefined,
    [],
  );

  const viewingOwnProfile = !profileUserId;
  const { data: ownProfile, isLoading: isOwnProfileLoading } = useMyProfile();
  const { data: publicProfile, isLoading: isPublicProfileLoading } =
    useUserProfile(profileUserId ?? "");
  const { data: myHistory } = useMyGameHistory();

  const profile = viewingOwnProfile ? ownProfile : publicProfile;
  const displayName =
    profile?.displayName || user?.name || profileUserId || "Player";
  const avatar = profile?.pictureUrl || user?.picture || "";
  const loading = viewingOwnProfile
    ? isAuthLoading || (isAuthenticated && isOwnProfileLoading)
    : isPublicProfileLoading;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-accent">
        <span className="animate-pulse font-semibold text-lg">
          Loading profile...
        </span>
      </div>
    );
  }

  if (viewingOwnProfile && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-300">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white font-sans pb-20 border-radius-10">
      <div className="relative h-48 md:h-64 w-full overflow-hidden rounded-2xl bg-zinc-900">
        {avatar ? (
          <img
            src={avatar}
            alt="Profile Banner"
            className="w-full h-full object-cover opacity-60"
          />
        ) : null}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#09090b]/40 to-[#09090b]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="relative group">
            {avatar ? (
              <img
                src={avatar}
                alt={displayName}
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-[#09090b] shadow-[0_0_20px_rgba(170,59,255,0.2)]"
              />
            ) : (
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#09090b] bg-zinc-800 flex items-center justify-center text-4xl font-black text-white">
                {displayName.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-accent blur-xl opacity-20 transition-all duration-300 group-hover:opacity-40" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white mt-4 tracking-wide">
            {displayName}
          </h1>
          {profile?.email && viewingOwnProfile && (
            <p className="text-zinc-400 font-medium text-sm mt-1">
              {profile.email}
            </p>
          )}

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl">
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

          {profile?.createdAt && (
            <p className="text-zinc-500 text-sm mt-4">
              Joined {formatDate(profile.createdAt)}
            </p>
          )}
        </div>

        {viewingOwnProfile && isAuthenticated && (
          <section className="mt-10">
            <h2 className="text-xl font-bold mb-4">Recently clicked games</h2>
            {myHistory && myHistory.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {myHistory.map((item) => (
                  <Link
                    key={item.id}
                    to="/game/$gameId"
                    params={{ gameId: item.igdbId.toString() }}
                    className="rounded-xl border border-white/10 bg-white/5 overflow-hidden no-underline"
                  >
                    <div className="aspect-3/4 bg-zinc-900">
                      {item.coverUrl ? (
                        <img
                          src={item.coverUrl}
                          alt={item.gameName}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="p-3">
                      <div className="font-semibold text-sm text-white line-clamp-2">
                        {item.gameName}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">
                        {formatDate(item.clickedAt)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-zinc-400">No recent game views yet.</p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
