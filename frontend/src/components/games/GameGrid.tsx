import type { Game } from "../../api/games/games";
import GameCard from "./GameCard";

type Props = {
  games?: Game[];
};

export default function GameGrid({ games }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {games?.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
