import { toast } from "react-toastify";
import type { Game } from "../../api/games";

type Props = {
  game: Game;
};

export default function GameCard({ game }: Props) {
  const handleClick = () => {
    toast.success(`Selected: ${game.name}`);
  };

  const releaseYear = game.first_release_date
    ? new Date(game.first_release_date * 1000).getFullYear()
    : null;

  const tags = [...(game.genres ?? []), ...(game.themes ?? [])].slice(0, 4);

  return (
    <div
      onClick={handleClick}
      className="
        relative w-44 rounded-2xl overflow-hidden
        bg-zinc-900/90 backdrop-blur-md
        shadow-lg cursor-pointer group
        transition-all duration-300
        hover:scale-[1.06]
        hover:shadow-[0_0_30px_rgba(168,85,247,0.35)]
      "
    >
      <div className="h-56 w-full bg-zinc-800 relative overflow-hidden">
        {game.cover?.url ? (
          <img
            className="
              h-full w-full object-cover
              transition-all duration-500
              group-hover:scale-110 group-hover:brightness-75
            "
            src={"https:" + game.cover.url.replace("t_thumb", "t_cover_big")}
            alt={game.name}
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-xs text-zinc-500">
            No image
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute top-0 left-0 w-full p-2 flex justify-between items-start">
          <p className="text-white text-xs font-semibold truncate max-w-[75%]">
            {game.name}
          </p>

          {game.total_rating && (
            <div className="text-[10px] px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300 backdrop-blur">
              ★ {game.total_rating.toFixed(0)}
            </div>
          )}
        </div>
      </div>

      <div className="p-2 space-y-1">
        <p className="text-sm text-white font-medium truncate">{game.name}</p>

        {releaseYear && (
          <p className="text-[11px] text-zinc-400">{releaseYear}</p>
        )}
      </div>

      <div
        className="
          absolute inset-0
          opacity-0 group-hover:opacity-100
          transition-all duration-300
          bg-gradient-to-t from-black via-black/90 to-purple-900/40
          backdrop-blur-md
          flex flex-col justify-end p-3
        "
      >
        <div className="space-y-1">
          <p className="text-white text-sm font-semibold leading-tight">
            {game.name}
          </p>

          {game.total_rating && (
            <p className="text-yellow-400 text-xs">
              ★ {game.total_rating.toFixed(1)} / 100
            </p>
          )}

          {game.total_rating_count && (
            <p className="text-zinc-400 text-xs">
              {game.total_rating_count} votes
            </p>
          )}

          {releaseYear && (
            <p className="text-zinc-400 text-xs">Released {releaseYear}</p>
          )}
        </div>

        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="
                  text-[10px] px-2 py-1 rounded-full
                  bg-purple-500/20 text-purple-200
                  border border-purple-400/20
                  backdrop-blur
                "
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
