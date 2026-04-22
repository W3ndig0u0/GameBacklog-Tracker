import type { Game } from "../../api/games";
import GameCard from "./GameCard";

type Props = {
  games?: Game[];
};

export default function GameGrid({ games }: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {games?.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
