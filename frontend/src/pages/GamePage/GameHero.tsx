import type { GameData } from "./types";
import { getImg } from "./utils";

interface GameHeroProps {
  g: GameData;
  gameInCollection: boolean;
  isAdding: boolean;
  isRemoving: boolean;
  onToggle: () => void;
}

export const GameHero = ({
  g,
  gameInCollection,
  isAdding,
  isRemoving,
  onToggle,
}: GameHeroProps) => {
  const bId = g?.screenshots?.[0]?.image_id || g?.artworks?.[1]?.image_id;
  const cId = g?.cover?.image_id || g?.artworks?.[0]?.image_id;

  return (
    <>
      <div className="h-[60vh] w-full relative overflow-hidden bg-zinc-900">
        {bId && (
          <img
            src={getImg(bId, "1080p")}
            className="w-full h-full object-cover opacity-30"
            alt="background"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
      </div>

      <div className="flex flex-col md:flex-row gap-8 -mt-32 relative z-10 items-start md:items-end max-w-6xl mx-auto px-6">
        {cId && (
          <img
            src={getImg(cId, "1080p")}
            className="w-64 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
            alt={g.name}
          />
        )}
        <div className="flex-1 pb-4">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic leading-none mb-4">
            {g.name}
          </h1>

          <button
            onClick={onToggle}
            disabled={isAdding || isRemoving}
            className={`px-8 py-3 rounded-lg font-bold uppercase transition-all active:scale-95 ${
              gameInCollection
                ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                : "bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-500/20"
            }`}
          >
            {gameInCollection ? "Remove from Collection" : "Add to Collection"}
          </button>
        </div>
      </div>
    </>
  );
};
