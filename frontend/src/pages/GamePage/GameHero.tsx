import { useState } from "react";
import type { UserGame } from "../../api/library/userGame";
import GameCollectionSelector from "../../components/collections/GameCollectionSelector";
import type { GameData } from "./types";
import { getImg } from "./utils";

interface GameHeroProps {
  g: GameData;
  gameInCollection: boolean;
  isAdding: boolean;
  isRemoving: boolean;
  onToggle: () => void;
  myGameData?: UserGame;
  isLoggedIn: boolean;
  updateGame: (data: { igdbId: string; updates: Partial<UserGame> }) => void;
}

const STATUS_COLORS = {
  BACKLOG: "bg-purple-500 shadow-purple-500/80",
  PLAYING: "bg-blue-500 shadow-blue-500/80",
  COMPLETED: "bg-emerald-500 shadow-emerald-500/80",
  DROPPED: "bg-red-500 shadow-red-500/80",
} as const;

const GAME_STATUSES = ["BACKLOG", "PLAYING", "COMPLETED", "DROPPED"] as const;

export const GameHero = ({
  g,
  gameInCollection,
  isAdding,
  isRemoving,
  onToggle,
  myGameData,
  updateGame,
  isLoggedIn,
}: GameHeroProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isFavorite = myGameData?.isFavorite ?? false;
  const gameStatus = myGameData?.status ?? "BACKLOG";
  const gameId = g.id.toString();

  const bgId = g?.screenshots?.[0]?.image_id || g?.artworks?.[1]?.image_id;
  const coverId = g?.cover?.image_id || g?.artworks?.[0]?.image_id;

  return (
    <>
      <div className="relative h-[60vh] w-full overflow-hidden bg-zinc-900">
        {bgId && (
          <img
            src={getImg(bgId, "1080p")}
            className="h-full w-full object-cover opacity-30"
            alt=""
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/20 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto -mt-32 flex max-w-6xl flex-col items-start gap-8 px-6 md:flex-row md:items-end">
        {coverId && (
          <img
            src={getImg(coverId, "1080p")}
            className="w-64 rounded-2xl border border-white/10 shadow-2xl"
            alt={g.name}
          />
        )}

        <div className="flex-1 pb-4">
          <h1 className="mb-6 text-5xl font-black uppercase italic leading-none tracking-tighter md:text-6xl">
            {g.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onToggle}
              disabled={isAdding || isRemoving}
              className="flex min-w-60 items-center justify-center rounded-xl px-8 py-3.5 font-bold uppercase transition active:scale-95"
            >
              {gameInCollection
                ? "Remove from Collection"
                : "Add to Collection"}
            </button>

            {isLoggedIn && (
              <>
                <button
                  onClick={() =>
                    updateGame({
                      igdbId: gameId,
                      updates: { isFavorite: !isFavorite },
                    })
                  }
                  className={`group rounded-xl border p-3.5 transition active:scale-95 ${
                    isFavorite
                      ? "border-pink-500/50 bg-pink-500/20 text-pink-500"
                      : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-pink-400"
                  }`}
                  aria-label="Toggle Favorite"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill={isFavorite ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`h-5 w-5 transition ${isFavorite ? "scale-110" : "group-hover:scale-110"}`}
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="group flex min-w-40 items-center justify-between gap-3 transition hover:bg-white/10 active:scale-95"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${STATUS_COLORS[gameStatus] || STATUS_COLORS.BACKLOG}`}
                      />
                      {gameStatus}
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`h-4 w-4 text-zinc-500 transition group-hover:text-zinc-300 ${isDropdownOpen ? "rotate-180" : ""}`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsDropdownOpen(false)}
                      />

                      <div className="absolute left-0 top-full z-50 mt-2 w-full backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
                        {GAME_STATUSES.map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              updateGame({
                                igdbId: gameId,
                                updates: { status },
                              });
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-2.5 text-left text-sm font-medium transition ${
                              gameStatus === status
                                ? "bg-purple-500/20 text-purple-300"
                                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {gameInCollection && <GameCollectionSelector igdbId={gameId} />}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
