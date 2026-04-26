import { useNavigate } from "@tanstack/react-router";
import type { Game } from "../../api/games/games";
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

  const getImg = (id: string, sz: string) =>
    id ? `https://images.igdb.com/igdb/image/upload/t_${sz}/${id}.jpg` : "";

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
          <img
            className={`
              h-full w-full object-cover
              transition-all duration-500
              group-hover:scale-110 group-hover:brightness-75
            `}
            src={getImg(game.artworks?.[0]?.image_id || "", "cover_big")}
            alt={game.name}
            loading="lazy"
          />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute top-0 left-0 w-full p-2 flex justify-between items-start z-10">
          {game.total_rating && (
            <div className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 backdrop-blur border border-yellow-500/30">
              {game.total_rating.toFixed(0)}%
            </div>
          )}
        </div>
      </div>

      <div className="p-2.5 space-y-0.5">
        <p className="text-sm text-white font-bold truncate tracking-tight">
          {game.name}
        </p>
        {releaseYear && (
          <p className="text-[10px] text-zinc-400 font-medium">{releaseYear}</p>
        )}
      </div>

      <div
        className="
          absolute inset-0
          opacity-0 group-hover:opacity-100
          transition-all duration-300
          bg-linear-to-t from-black via-black/95 to-purple-900/40
          backdrop-blur-sm
          flex flex-col justify-end p-4
          z-1
        "
      >
        <div className="space-y-1 transform text-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-base font-black leading-tight tracking-tighter uppercase truncate px-2">
            {game.name}
          </p>

          <div className="flex items-center justify-center gap-3">
            {game.total_rating && (
              <p className="text-yellow-400 text-[10px] font-bold tracking-tighter">
                SCORE: {Math.round(game.total_rating)}%
              </p>
            )}

            {game.total_rating_count && (
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-tighter">
                {game.total_rating_count} VOTES
              </p>
            )}
          </div>
          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  title={tag.name}
                  className="
                    max-w-17.5 md:max-w-22.5
                    truncate whitespace-nowrap
                    text-[8px] px-1.5 py-0.5 
                    bg-[#a855f7]/8 
                    text-[#a855f7]
                    border border-[#a855f7]/20
                    font-black uppercase tracking-tight 
                    rounded-sm
                    cursor-default
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
