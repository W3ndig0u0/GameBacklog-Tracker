import { useGameById } from "../../hooks/games/useGameById";
import GameCard from "./GameCard";

type Props = {
  igdbId: string;
};

export const GameCardWrapper = ({ igdbId }: Props) => {
  const { data: game, isLoading } = useGameById(String(igdbId));
  if (isLoading) {
    return (
      <div className="w-44 h-72 rounded-2xl bg-zinc-900/50 animate-pulse border border-zinc-800" />
    );
  }

  if (!game) return null;
  return <GameCard game={game} />;
};
