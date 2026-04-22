import { toast } from "react-toastify";
import type { Game } from "../../api/games";

type Props = {
  game: Game;
};

export default function GameCard({ game }: Props) {
  const handleClick = () => {
    toast.success(`Selected: ${game.name}`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-44 rounded-xl overflow-hidden bg-zinc-900 shadow-lg cursor-pointer group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
    >
      <div className="h-56 w-full bg-zinc-800 relative overflow-hidden">
        {game.cover?.url ? (
          <img
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            src={"https:" + game.cover.url.replace("t_thumb", "t_cover_big")}
            alt={game.name}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-xs text-zinc-500">
            No image
          </div>
        )}

        <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/80 to-transparent p-2">
          <p className="text-white text-xs font-semibold truncate">
            {game.name}
          </p>
        </div>
      </div>

      <div className="p-2">
        <p className="text-sm text-white font-medium truncate">{game.name}</p>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-purple-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3 backdrop-blur-sm">
        <div className="border-l-2 border-purple-500 pl-2">
          <p className="text-white text-sm font-bold">{game.name}</p>

          {game.total_rating && (
            <p className="text-yellow-400 text-xs mt-1">
              ★ {game.total_rating.toFixed(1)} / 100
            </p>
          )}

          {game.total_rating_count && (
            <p className="text-zinc-300 text-xs">
              Votes: {game.total_rating_count}
            </p>
          )}

          {game.first_release_date && (
            <p className="text-zinc-300 text-xs">
              Released: {new Date(game.first_release_date * 1000).getFullYear()}
            </p>
          )}
        </div>

        <div className="flex gap-1 mt-2 flex-wrap">
          <span className="text-[10px] px-2 py-1 bg-purple-600/40 rounded-full text-purple-200">
            Game
          </span>
          {game.total_rating && game.total_rating > 80 && (
            <span className="text-[10px] px-2 py-1 bg-yellow-500/30 rounded-full text-yellow-300">
              Top Rated
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
