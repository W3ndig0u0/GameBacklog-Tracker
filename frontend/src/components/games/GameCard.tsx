import type { Game } from "../../api/games";

type Props = {
  game: Game;
};

export default function GameCard({ game }: Props) {
  return (
    <div className="w-40 bg-zinc-900 rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer">
      <div className="h-52 w-full bg-zinc-800">
        {game.cover?.url ? (
          <img
            className="h-full w-full object-cover"
            src={"https:" + game.cover.url.replace("t_thumb", "t_cover_big")}
            alt={game.name}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-xs text-zinc-500">
            No image
          </div>
        )}
      </div>

      <div className="p-2 space-y-1">
        <p className="text-sm font-medium text-white truncate">{game.name}</p>

        <div className="flex items-center justify-between">
          {game.total_rating ? (
            <p className="text-xs text-zinc-400">
              ⭐ {game.total_rating.toFixed(0)}
            </p>
          ) : (
            <p className="text-xs text-zinc-500">No rating</p>
          )}

          {game.total_rating_count ? (
            <p className="text-xs text-zinc-500">({game.total_rating_count})</p>
          ) : null}
        </div>

        {game.genres?.length ? (
          <div className="flex flex-wrap gap-1 mt-1">
            {game.genres.slice(0, 2).map((g, i) => (
              <span
                key={i}
                className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-300 rounded"
              >
                {g.name}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
