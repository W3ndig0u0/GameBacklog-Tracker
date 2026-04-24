import { useParams } from "@tanstack/react-router";
import { GameCardWrapper } from "../components/games/GameCardWrapper";
import { useAddGame } from "../hooks/useAddGame";
import { useCollection } from "../hooks/useCollection";
import { useGameById } from "../hooks/useGameById";
import { useRemoveFromCollection } from "../hooks/useRemoveFromCollection";

const getImg = (id: string, sz: string) =>
  id ? `https://images.igdb.com/igdb/image/upload/t_${sz}/${id}.jpg` : "";

const GamePage = () => {
  const { mutate: addGame, isPending } = useAddGame();
  const { mutate: removeGame } = useRemoveFromCollection();
  const { data: collection } = useCollection();

  const { gameId } = useParams({ from: "/game/$gameId" });
  const { data, isLoading } = useGameById(gameId);
  const g = data;
  const gameInCollection = collection?.find((item) => item.igdbId === g?.id);
  const handleAdd = () => {
    addGame(gameId);
  };

  const handleRemove = () => {
    removeGame(gameId);
  };

  if (isLoading || !g)
    return (
      <div className="p-20 text-accent bg-bg h-screen uppercase font-bold">
        Loading...
      </div>
    );

  const bId = g.screenshots?.[0]?.image_id || g.artworks?.[1]?.image_id;
  const cId = g.cover?.image_id || g.artworks?.[0]?.image_id;
  const themes = g.themes ?? [];
  const genres = g.genres ?? [];
  const game_modes = g.game_modes ?? [];
  const platforms = g.platforms ?? [];
  const video = g.videos?.[0];
  console.log(g);

  return (
    <div className="bg-bg text-text min-h-screen">
      <div className="h-100 bg-zinc-900 relative">
        {bId && (
          <img
            src={getImg(bId, "1080p")}
            className="w-full h-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg" />
      </div>

      <div className="max-w-4xl mx-auto p-6 -mt-20 relative">
        <div className="flex gap-6 items-end mb-10">
          {cId && (
            <img
              src={getImg(cId, "1080p")}
              className="w-82 rounded-xl shadow-2xl border border-white/5"
            />
          )}
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic">
              {g.name}
            </h1>
            {gameInCollection ? (
              <button
                onClick={handleRemove}
                disabled={isPending}
                className="btn-primary mt-4"
              >
                Remove from List
              </button>
            ) : (
              <button
                onClick={handleAdd}
                disabled={isPending}
                className="btn-primary mt-4"
              >
                Add to List
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex gap-6 text-xs font-bold uppercase text-zinc-500 border-t border-white/5 pt-6">
            <span>
              Rating:{" "}
              <b className="text-yellow-500">{g.total_rating?.toFixed(0)}%</b>
            </span>
            <span>
              Year:{" "}
              <b className="text-yellow-500">
                {g.first_release_date
                  ? new Date(g.first_release_date * 1000).getFullYear()
                  : "N/A"}
              </b>
            </span>
            <span>
              Reviewed by:{" "}
              <b className="text-yellow-500">{g.total_rating_count} </b> people
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {themes.length > 0 ? (
              themes.map((theme, index) => (
                <span
                  key={index}
                  className="text-[12px] px-3 py-1 rounded-full
        bg-purple-500/10 text-purple-200
        border border-purple-500/20
        font-semibold uppercase tracking-wider"
                >
                  {theme.name}
                </span>
              ))
            ) : (
              <span className="text-[12px] text-gray-400">N/A</span>
            )}
            {genres.length > 0 ? (
              genres.map((genre, index) => (
                <span
                  key={index}
                  className="text-[12px] px-3 py-1 rounded-full
        bg-purple-500/10 text-purple-200
        border border-purple-500/20 
        font-semibold uppercase tracking-wider"
                >
                  {genre.name}
                </span>
              ))
            ) : (
              <span className="text-[12px] text-gray-400">N/A</span>
            )}
          </div>
          <div>
            {game_modes.length > 0 ? (
              game_modes.map((genre, index) => (
                <span
                  key={index}
                  className="text-[12px] px-3 py-1 rounded-full
        bg-purple-500/10 text-purple-200
        border border-purple-500/20
        font-semibold uppercase tracking-wider"
                >
                  {genre.name}
                </span>
              ))
            ) : (
              <span className="text-[12px] text-gray-400">N/A</span>
            )}
          </div>
          <div className="">
            <h2>Platforms:</h2>
            {platforms.length > 0 ? (
              platforms.map((platform, index) => (
                <span
                  key={index}
                  className="text-[12px] px-3 py-1 rounded-full
        bg-purple-500/10 text-purple-200
        border border-purple-500/20
        font-semibold uppercase tracking-wider"
                >
                  {platform.name}
                </span>
              ))
            ) : (
              <span className="text-[12px] text-gray-400">N/A</span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-zinc-300">Summary</h1>
          <p className="text-zinc-300 text-lg leading-relaxed">
            Summary: {g.summary}
          </p>
          <h1 className="text-2xl font-bold text-zinc-300">Story</h1>
          <p className="text-zinc-300 text-lg leading-relaxed">
            Story: {g.storyline}
          </p>

          <div className="artworks">
            <h1 className="text-2xl font-bold text-zinc-300">Artworks</h1>
            <p>
              {g.artworks?.map((s) => (
                <img
                  key={s.image_id}
                  src={getImg(s.image_id, "1080p")}
                  className="w-full h-full object-cover"
                />
              ))}
            </p>
          </div>

          <div className="screenshots">
            <h1 className="text-2xl font-bold text-zinc-300">Screenshots</h1>
            <p>
              {g.screenshots?.map((s) => (
                <img
                  key={s.image_id}
                  src={getImg(s.image_id, "1080p")}
                  className="w-full h-full object-cover"
                />
              ))}
            </p>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-300">Videos</h1>
            <p>
              {video && (
                <iframe
                  className="flex justify-center items-center w-full h-96"
                  key={video.video_id}
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${video.video_id}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-zinc-300">Similar Games</h1>
        <div className="flex flex-wrap justify-center gap-4">
          {g.similar_games?.map((game) => (
            <GameCardWrapper key={game.id} igdbId={game.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamePage;
