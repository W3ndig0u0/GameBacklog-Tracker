import type { Game } from "../../api/games";
import GameCard from "./GameCard";

type Props = {
  games?: Game[];
};

export default function GameGrid({ games }: Props) {
  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
      {games?.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
