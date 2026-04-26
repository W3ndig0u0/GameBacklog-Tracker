import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { Game } from "../../api/games/games";

const Icons = {
  Play: () => <path d="M8 5v14l11-7-11-7z" />,
  Details: () => (
    <path d="M15.5 14h-.8l-.3-.3a6 6 0 10-.7.7l.3.3v.8L20 21l1-1-5.5-6zM10 14a4 4 0 110-8 4 4 0 010 8z" />
  ),
  LibraryMain: () => <path d="M4 4h16v14H4z" />,
  LibraryAccent: () => (
    <path d="M8 8h8v2H8zM8 12h8v2H8z" className="fill-zinc-950" />
  ),
  Save: () => (
    <path d="M12 2l2.8 5.7L21 8.6l-4.5 4.4 1.1 6.2L12 16.8 6.4 19.2l1.1-6.2L3 8.6l6.2-.9L12 2z" />
  ),
};

const tagToneClasses = [
  "border-purple-400/40 bg-purple-500/15 text-purple-300",
  "border-emerald-400/40 bg-emerald-500/15 text-emerald-300",
  "border-blue-400/40 bg-blue-500/15 text-blue-300",
] as const;

const getImageUrl = (game: Game) => {
  if (game.cover?.url)
    return `https:${game.cover.url.replace("t_thumb", "t_1080p")}`;
  if (game.artworks?.[0]?.image_id)
    return `https://images.igdb.com/igdb/image/upload/t_1080p/${game.artworks[0].image_id}.jpg`;
  if (game.screenshots?.[0]?.image_id)
    return `https://images.igdb.com/igdb/image/upload/t_1080p/${game.screenshots[0].image_id}.jpg`;
  return "";
};

const getGameTags = (game: Game) => {
  return [
    ...(game.genres ?? []),
    ...(game.themes ?? []),
    ...(game.game_modes ?? []),
  ]
    .map((tag) => tag.name)
    .filter(Boolean)
    .slice(0, 4);
};

type HeroCarouselProps = {
  games: Game[];
  userName?: string;
  isAuthenticated: boolean;
  libraryCount?: number;
  favoritesCount?: number;
  playingCount?: number;
};

export default function HeroCarousel({
  games,
  userName,
  isAuthenticated,
  libraryCount = 0,
  favoritesCount = 0,
  playingCount = 0,
}: HeroCarouselProps) {
  const { loginWithRedirect } = useAuth0();
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = useMemo(() => games.slice(0, 5), [games]);
  const activeGame = slides.length ? slides[activeIndex % slides.length] : null;

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, [slides.length]);

  if (!activeGame) return null;

  const backdrop = getImageUrl(activeGame);
  const previewSummary = activeGame.summary?.trim();
  const previewTags = getGameTags(activeGame);

  const stats = [
    {
      label: "Library",
      value: libraryCount,
      color: "text-white",
      borderHover: "hover:border-purple-400/50",
    },
    {
      label: "★ Favorite",
      value: favoritesCount,
      color: "text-pink-400",
      borderHover: "hover:border-pink-400/50",
    },
    {
      label: "Playing",
      value: playingCount,
      color: "text-emerald-400",
      borderHover: "hover:border-emerald-400/50",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.2),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.1),transparent_40%)]" />

      <div className="relative grid min-h-64 lg:min-h-80 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col justify-between gap-5 p-6 sm:p-8 lg:p-10">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center rounded-full border border-purple-500/50 bg-purple-500/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.4em] text-purple-300 backdrop-blur-sm">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="mr-2 h-3.5 w-3.5 fill-purple-300"
                >
                  <Icons.Play />
                </svg>
                {isAuthenticated
                  ? `Welcome back${userName ? `, ${userName}` : ""}`
                  : "Featured Game"}
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.9] text-white drop-shadow-lg">
                {activeGame.name}
              </h1>

              <p className="max-w-lg text-sm font-medium leading-relaxed text-zinc-300">
                {isAuthenticated
                  ? "Pick up where you left off, keep your backlog tidy, and save the games you actually want to return to."
                  : "Browse trending games, save the ones that matter, and build a library that feels personal."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/game/$gameId"
                params={{ gameId: activeGame.id.toString() }}
                className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition duration-200 bg-linear-to-r from-purple-600 to-purple-500 text-white shadow-lg hover:from-purple-500 hover:to-purple-400 hover:shadow-purple-500/50"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="h-4 w-4 fill-white"
                >
                  <Icons.Details />
                </svg>
                View Details
              </Link>

              {isAuthenticated ? (
                <Link
                  to="/library"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition duration-200 border border-white/30 bg-white/5 text-zinc-100 backdrop-blur-sm hover:border-white/60 hover:bg-white/10"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden
                    className="h-4 w-4 fill-zinc-100"
                  >
                    <Icons.LibraryMain />
                    <Icons.LibraryAccent />
                  </svg>
                  My Library
                </Link>
              ) : (
                <button
                  onClick={() => loginWithRedirect()}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition duration-200 border border-emerald-500/50 bg-emerald-500/10 text-emerald-300 backdrop-blur-sm hover:border-emerald-400/80 hover:bg-emerald-500/20"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden
                    className="h-4 w-4 fill-emerald-300"
                  >
                    <Icons.Save />
                  </svg>
                  Save Game
                </button>
              )}
            </div>
          </div>

          {isAuthenticated && (
            <div className="grid w-full grid-cols-3 gap-3">
              {stats.map(({ label, value, color, borderHover }) => (
                <div
                  key={label}
                  className={`rounded-xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm transition duration-200 hover:bg-white/10 ${borderHover}`}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    {label}
                  </p>
                  <p
                    className={`mt-1.5 text-xl sm:text-2xl font-black ${color}`}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative min-h-full hidden lg:block">
          <div className="absolute inset-0 bg-linear-to-l from-transparent via-transparent to-zinc-950/40 z-10" />

          {backdrop ? (
            <img
              src={backdrop}
              alt={activeGame.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-linear-to-b from-zinc-800 to-zinc-900" />
          )}

          <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-transparent to-transparent z-10" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 space-y-3 z-20">
            <div className="max-w-xs rounded-2xl border border-white/20 bg-zinc-950/70 p-4 backdrop-blur-xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-purple-300">
                Featured
              </p>
              <p className="mt-2 text-base font-black uppercase tracking-tight text-white line-clamp-2">
                {activeGame.name}
              </p>

              {previewSummary ? (
                <p className="mt-2 max-h-12 overflow-hidden text-xs leading-relaxed text-zinc-300">
                  {previewSummary}
                </p>
              ) : previewTags.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {previewTags.map((tag, i) => (
                    <span
                      key={tag}
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${tagToneClasses[i % tagToneClasses.length]}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                  Explore this game in detail.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 rounded-full border border-white/10 bg-zinc-950/50 px-3 py-2 backdrop-blur-md lg:bottom-8 lg:left-auto lg:right-8 lg:translate-x-0 z-30">
        {slides.map((game, index) => (
          <button
            key={game.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Show slide ${index + 1} of ${slides.length}: ${game.name}`}
            className={`rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "w-10 h-3 bg-purple-500 shadow-xl shadow-purple-600/60 border border-purple-400/80"
                : "w-2.5 h-2.5 bg-white/25 hover:bg-white/60 hover:shadow-md hover:shadow-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
