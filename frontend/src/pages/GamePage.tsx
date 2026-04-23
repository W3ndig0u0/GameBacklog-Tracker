import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { useGameById } from "../hooks/useGameById";

const GamePage = () => {
  const { gameId } = useParams({ from: "/game/$gameId" });
  const { getAccessTokenSilently } = useAuth0();
  const { data: games, isLoading } = useGameById(gameId);
  const game = games?.[0];

  const handleAdd = async () => {
    try {
      const token = await getAccessTokenSilently();
      await fetch("http://localhost:8080/api/library/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ igdbId: gameId }),
      });
      toast.success("Saved to backlog");
    } catch {
      toast.error("Error saving game");
    }
  };

  if (isLoading || !game)
    return <div className="p-20 text-accent bg-bg h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Enkel Banner */}
      <div className="h-64 w-full bg-zinc-800">
        <img
          src={`https:${game.screenshots?.[0]?.url.replace("t_thumb", "t_1080p")}`}
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      <div className="max-w-4xl mx-auto p-6 -mt-20 relative">
        <div className="flex gap-8 items-end">
          <img
            src={`https:${game.cover?.url.replace("t_thumb", "t_cover_big")}`}
            className="w-48 rounded-xl shadow-custom border border-border"
          />
          <div className="pb-4">
            <h1 className="text-4xl font-black text-text-h uppercase tracking-tighter">
              {game.name}
            </h1>
            <button
              onClick={handleAdd}
              className="mt-4 px-8 py-2 bg-accent text-white font-bold rounded-lg hover:opacity-80 transition-opacity"
            >
              Add to List
            </button>
          </div>
        </div>

        <div className="mt-10 space-y-4">
          <p className="text-zinc-400 leading-relaxed">{game.summary}</p>
          <div className="flex gap-4 text-xs font-bold text-zinc-500 uppercase">
            <span>Rating: {game.total_rating?.toFixed(0)}%</span>
            <span>
              Year: {new Date(game.first_release_date * 1000).getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
