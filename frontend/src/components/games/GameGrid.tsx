import type { Game } from "../../api/games/games";
import GameCard from "./GameCard";

type Props = {
  games?: Game[];
};

export default function GameGrid({ games }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 justify-items-center sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5">
      {games?.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
