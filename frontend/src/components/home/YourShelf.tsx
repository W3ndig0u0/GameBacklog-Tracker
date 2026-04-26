import { Link } from "@tanstack/react-router";
import type { UserGame } from "../../api/library/userGame";
import { GameCardWrapper } from "../games/GameCardWrapper";

type YourShelfProps = {
  libraryCount: number;
  playingCount: number;
  backlogCount: number;
  completedCount: number;
  droppedCount: number;
  favoriteGames: UserGame[];
  recentlyAdded: UserGame[];
};

export default function YourShelf({
  libraryCount,
  playingCount,
  backlogCount,
  completedCount,
  droppedCount,
  favoriteGames,
  recentlyAdded,
}: YourShelfProps) {
  const stats = [
    { label: "Total", value: libraryCount, color: "text-white" },
    { label: "Playing", value: playingCount, color: "text-emerald-400" },
    { label: "Backlog", value: backlogCount, color: "text-blue-400" },
    { label: "Done", value: completedCount, color: "text-purple-400" },
    { label: "Dropped", value: droppedCount, color: "text-zinc-400" },
  ];

  const renderGameSection = (
    title: string,
    games: UserGame[],
    gridCols: string,
  ) => {
    if (!games.length) return null;

    return (
      <div className="space-y-3 pt-4 border-t border-zinc-900">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-300">
          {title}
        </h3>
        <div className={`grid gap-4 ${gridCols}`}>
          {games.map(
            (game) =>
              game.igdbId && (
                <Link
                  key={game.igdbId}
                  to="/game/$gameId"
                  params={{ gameId: game.igdbId.toString() }}
                >
                  <GameCardWrapper igdbId={game.igdbId.toString()} />
                </Link>
              ),
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="space-y-6 rounded-4xl border border-white/10 bg-white/5 p-5 md:p-8">
      <div className="flex items-baseline gap-4 border-b border-zinc-900 pb-4">
        <h2 className="shrink-0 text-2xl font-black italic tracking-tighter text-white uppercase md:text-3xl">
          Your Shelf
        </h2>
        <div className="h-px w-full bg-linear-to-r from-zinc-800 to-transparent opacity-50" />
        <span className="whitespace-nowrap font-mono tracking-widest text-zinc-600 uppercase">
          [{libraryCount.toString().padStart(2, "0")}]
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {stats.map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
          >
            <p className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
              {label}
            </p>
            <p className={`mt-2 text-2xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {renderGameSection(
        "★ Your Favorites",
        favoriteGames,
        "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
      )}
      {renderGameSection(
        "Recently Added",
        recentlyAdded,
        "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
      )}

      <div className="flex flex-wrap gap-3 pt-4 border-t border-zinc-900">
        <Link
          to="/library"
          className="rounded-full bg-purple-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-purple-500"
        >
          View Full Library
        </Link>
        <Link
          to="/library"
          className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-zinc-100 transition hover:bg-white/10"
        >
          Organize Collections
        </Link>
      </div>
    </section>
  );
}
