import type { Game } from "../../api/games/games";
import GameGrid from "./GameGrid";

type Props = {
  title: string;
  data?: Game[];
};

export default function GameSection({ title, data }: Props) {
  return (
    <section className="mb-16 space-y-6 rounded-4xl text-start border border-white/10 bg-white/5 p-5 md:p-8">
      <div className="flex items-baseline mb-8 border-b border-zinc-900 pb-2">
        <h2 className="text-white text-2xl md:text-3xl font-black uppercase italic tracking-tighter shrink-0">
          {title}
        </h2>
        <div className="h-px w-full bg-linear-to-r from-zinc-800 to-transparent opacity-50" />

        {data && (
          <span className="font-mono text-zinc-600 uppercase tracking-widest whitespace-nowrap">
            [{data.length.toString().padStart(2, "0")}]
          </span>
        )}
      </div>

      <div className="w-full">
        <GameGrid games={data} />
      </div>
    </section>
  );
}
