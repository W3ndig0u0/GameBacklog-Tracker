import type { Game } from "../../api/games";
import GameGrid from "./GameGrid";

type Props = {
  title: string;
  data?: Game[];
};

export default function GameSection({ title, data }: Props) {
  return (
    <section className="mb-10 flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
      <div className="w-full flex justify-center">
        <GameGrid games={data} />
      </div>
    </section>
  );
}
