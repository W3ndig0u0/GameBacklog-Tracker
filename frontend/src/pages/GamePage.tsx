import { useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { GameCardWrapper } from "../components/games/GameCardWrapper";
import { useAddGame } from "../hooks/useAddGame";
import { useCollection } from "../hooks/useCollection";
import { useGameById } from "../hooks/useGameById";
import { useRemoveFromCollection } from "../hooks/useRemoveFromCollection";

const getImg = (id: string, sz: string) =>
  id ? `https://images.igdb.com/igdb/image/upload/t_${sz}/${id}.jpg` : "";

const PrimaryBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="text-xs px-3 py-1.5 rounded-md bg-indigo-500/15 text-indigo-100 font-bold uppercase tracking-wider shadow-sm">
    {children}
  </span>
);

const GhostBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="text-xs px-3 py-1.5 rounded-md bg-white/5 text-zinc-300 border border-white/10 font-medium tracking-wide">
    {children}
  </span>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold text-zinc-100 mt-10 mb-4">{children}</h2>
);

const GamePage = () => {
  const { gameId } = useParams({ from: "/game/$gameId" });

  const { mutate: addGame, isPending: isAdding } = useAddGame();
  const { mutate: removeGame, isPending: isRemoving } =
    useRemoveFromCollection();
  const { data: collection } = useCollection();
  const { data: g, isLoading } = useGameById(gameId);

  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const gameInCollection = useMemo(
    () => collection?.some((item) => item.igdbId === g?.id),
    [collection, g?.id],
  );

  const bId = g?.screenshots?.[0]?.image_id || g?.artworks?.[1]?.image_id;
  const cId = g?.cover?.image_id || g?.artworks?.[0]?.image_id;
  const releaseYear = g?.first_release_date
    ? new Date(g.first_release_date * 1000).getFullYear()
    : "N/A";

  const primaryGenres = g?.genres || [];
  const primaryThemes = g?.themes || [];
  const platforms = g?.platforms || [];

  if (isLoading || !g) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg text-accent uppercase font-black animate-pulse">
        Loading Game Data...
      </div>
    );
  }

  return (
    <>
      <div className="bg-bg text-text min-h-screen pb-20">
        <div className="h-[60vh] w-full relative overflow-hidden bg-zinc-900">
          {bId && (
            <img
              src={getImg(bId, "1080p")}
              className="w-full h-full object-cover opacity-30"
              alt="background"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8 -mt-32 relative z-10 items-start md:items-end">
            {cId && (
              <img
                src={getImg(cId, "1080p")}
                className="w-64 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
                alt={g.name}
              />
            )}
            <div className="flex-1 pb-4">
              <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic leading-none mb-4">
                {g.name}
              </h1>

              <button
                onClick={() =>
                  gameInCollection ? removeGame(gameId) : addGame(gameId)
                }
                disabled={isAdding || isRemoving}
                className={`px-8 py-3 rounded-lg font-bold uppercase transition-all active:scale-95 ${
                  gameInCollection
                    ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                    : "bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-500/20"
                }`}
              >
                {gameInCollection
                  ? "Remove from Collection"
                  : "Add to Collection"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 py-6 border-y border-white/5">
            {[
              {
                label: "Rating",
                val: `${g.total_rating?.toFixed(0) || 0}%`,
                color: "text-yellow-500",
              },
              { label: "Release", val: releaseYear, color: "text-blue-400" },
              {
                label: "Reviews",
                val: g.total_rating_count || 0,
                color: "text-emerald-400",
              },
              {
                label: "Platforms",
                val: g.platforms?.length || 0,
                color: "text-purple-400",
              },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                  {stat.label}
                </span>
                <span className={`text-xl font-black ${stat.color}`}>
                  {stat.val}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 mt-8">
            {primaryGenres.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 cursor-default">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mr-2">
                  Genres
                </span>
                {primaryGenres.map((genre) => (
                  <PrimaryBadge key={genre.id}>{genre.name}</PrimaryBadge>
                ))}
              </div>
            )}

            {primaryThemes.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 cursor-default">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mr-2">
                  Themes
                </span>
                {primaryThemes.map((theme) => (
                  <PrimaryBadge key={theme.id}>{theme.name}</PrimaryBadge>
                ))}
              </div>
            )}

            {platforms.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 cursor-default">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mr-2">
                  Playable On
                </span>
                {platforms.map((platform) => (
                  <GhostBadge key={platform.id}>{platform.name}</GhostBadge>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
            <div className="lg:col-span-2 space-y-10">
              <section>
                <SectionTitle>Summary</SectionTitle>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  {g.summary}
                </p>
              </section>

              {g.storyline && (
                <section>
                  <SectionTitle>Storyline</SectionTitle>
                  <p className="text-zinc-400 text-lg leading-relaxed">
                    {g.storyline}
                  </p>
                </section>
              )}

              <section>
                <SectionTitle>Media</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {g.screenshots?.slice(0, 8).map((s) => (
                    <img
                      key={s.image_id}
                      src={getImg(s.image_id, "720p")}
                      className="rounded-xl border border-white/5 hover:border-white/30 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 cursor-zoom-in"
                      alt="screenshot"
                      onClick={() => setLightboxImg(s.image_id)}
                    />
                  ))}
                </div>
                {g.videos?.[0] && (
                  <div className="mt-6 aspect-video rounded-2xl overflow-hidden border border-white/5">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${g.videos[0].video_id}`}
                      title="Trailer"
                      allowFullScreen
                    />
                  </div>
                )}
              </section>
            </div>

            <aside className="lg:col-span-1">
              <div className="text-center lg:text-left">
                <SectionTitle>Similar Games</SectionTitle>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 justify-items-center">
                {" "}
                {g.similar_games?.slice(0, 10).map((game) => (
                  <div
                    key={game.id}
                    className="w-full flex justify-center direction-col"
                  >
                    <GameCardWrapper igdbId={game.id} />
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>

      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm cursor-zoom-out transition-opacity duration-300"
          onClick={() => setLightboxImg(null)}
        >
          <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-0 right-0 z-50 p-2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full transition-colors"
              aria-label="Close fullscreen"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <img
              src={getImg(lightboxImg, "1080p")}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              alt="Fullscreen screenshot"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default GamePage;
