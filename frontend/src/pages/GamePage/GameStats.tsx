import type { GameData } from "./types";

export const GameStats = ({ g }: { g: GameData }) => {
  const releaseYear = g?.first_release_date
    ? new Date(g.first_release_date * 1000).getFullYear()
    : "N/A";

  const stats = [
    {
      label: "Rating",
      val: `${g.total_rating?.toFixed(0) || 0}%`,
      color: "text-yellow-500",
    },
    {
      label: "Rated by",
      val: g.total_rating_count?.toString() || "0",
      color: "text-emerald-400",
    },
    { label: "Released", val: releaseYear.toString(), color: "text-blue-400" },
    {
      label: "Platforms",
      val: g.platforms?.length.toString() || "0",
      color: "text-purple-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 py-6 border-y border-white/5">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
            {stat.label}
          </span>
          <span className={`text-xl font-black ${stat.color}`}>{stat.val}</span>
        </div>
      ))}
    </div>
  );
};
