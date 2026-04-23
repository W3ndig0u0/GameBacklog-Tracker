import { useParams } from "@tanstack/react-router";
import { useAddGame } from "../hooks/useAddGame";
import { useGameById } from "../hooks/useGameById";

const getImg = (id: string, sz: string) =>
  id ? `https://images.igdb.com/igdb/image/upload/t_${sz}/${id}.jpg` : "";

const GamePage = () => {
  const { mutate: addGame, isPending } = useAddGame();
  const { gameId } = useParams({ from: "/game/$gameId" });
  const { data, isLoading } = useGameById(gameId);
  const g = data?.[0];

  const handleAdd = () => {
    addGame(gameId);
  };
  console.log("Game details:", g);

  if (isLoading || !g)
    return (
      <div className="p-20 text-accent bg-bg h-screen uppercase font-bold">
        Loading...
      </div>
    );

  const bId = g.screenshots?.[0]?.image_id || g.artworks?.[1]?.image_id;
  const cId = g.cover?.image_id || g.artworks?.[0]?.image_id;

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
            <button
              onClick={handleAdd}
              disabled={isPending}
              className="btn-primary mt-4"
            >
              Add to List
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-zinc-300 text-lg leading-relaxed">{g.summary}</p>

          <div className="flex gap-6 text-xs font-bold uppercase text-zinc-500 border-t border-white/5 pt-6">
            <span>
              Rating:{" "}
              <b className="text-yellow-500">{g.total_rating?.toFixed(0)}%</b>
            </span>
            <span>
              Year:{" "}
              <b>
                {g.first_release_date
                  ? new Date(g.first_release_date * 1000).getFullYear()
                  : "N/A"}
              </b>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
