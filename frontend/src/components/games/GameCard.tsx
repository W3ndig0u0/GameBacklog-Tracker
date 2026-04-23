import { useNavigate } from "@tanstack/react-router";
import type { Game } from "../../api/games";
type Props = {
  game: Game;
};

export default function GameCard({ game }: Props) {
  const navigate = useNavigate();
  const handleClick = async () => {
    navigate({
      to: "/game/$gameId",
      params: { gameId: game.id.toString() },
    });
  };

  const releaseYear = game.first_release_date
    ? new Date(game.first_release_date * 1000).getFullYear()
    : null;

  const tags = [...(game.genres ?? []), ...(game.themes ?? [])].slice(0, 4);

  const getCoverUrl = (url: string) => {
    return `https:${url.replace("t_thumb", "t_cover_big")}`;
  };

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
            className={`
              h-full w-full object-cover
              transition-all duration-500
              group-hover:scale-110 group-hover:brightness-75
            `}
            src={getCoverUrl(game.cover.url)}
            alt={game.name}
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-xs text-zinc-500 italic">
            No image available
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute top-0 left-0 w-full p-2 flex justify-between items-start z-10">
          <p className="text-white text-[10px] font-bold truncate max-w-[70%] drop-shadow-md uppercase tracking-tighter">
            {game.name}
          </p>

          {game.total_rating && (
            <div className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 backdrop-blur border border-yellow-500/30">
              ★ {game.total_rating.toFixed(0)}
            </div>
          )}
        </div>
      </div>

      <div className="p-2.5 space-y-0.5">
        <p className="text-sm text-white font-bold truncate tracking-tight">
          {game.name}
        </p>
        <div className="flex justify-between items-center">
          {releaseYear && (
            <p className="text-[10px] text-zinc-400 font-medium">
              {releaseYear}
            </p>
          )}
        </div>
      </div>

      <div
        className="
          absolute inset-0
          opacity-0 group-hover:opacity-100
          transition-all duration-300
          bg-gradient-to-t from-black via-black/95 to-purple-900/40
          backdrop-blur-sm
          flex flex-col justify-end p-4
          z-20
        "
      >
        <div className="space-y-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-base font-black leading-tight tracking-tighter uppercase">
            {game.name}
          </p>

          {game.total_rating && (
            <p className="text-yellow-400 text-[11px] font-bold">
              SCORE: {game.total_rating.toFixed(1)}
            </p>
          )}

          <div className="flex gap-2 text-[10px] text-zinc-400 font-bold uppercase">
            {game.total_rating_count && (
              <span>{game.total_rating_count} Votes</span>
            )}
            {releaseYear && <span>• {releaseYear}</span>}
          </div>

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="
                    text-[9px] px-2 py-0.5 rounded-md
                    bg-purple-600/30 text-purple-100
                    border border-purple-400/30
                    font-bold uppercase tracking-widest
                  "
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
