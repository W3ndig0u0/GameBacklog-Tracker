import type { Game } from "../../api/games";

type Props = {
  game: Game;
};

export default function GameCard({ game }: Props) {
  return (
    <div style={{ width: "150px" }}>
      <img
        width="150"
        src={
          game.cover?.url
            ? "https:" + game.cover.url.replace("t_thumb", "t_cover_big")
            : ""
        }
        alt={game.name}
      />
      <p>{game.name}</p>
    </div>
  );
}
