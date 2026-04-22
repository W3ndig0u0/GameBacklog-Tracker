import type { Game } from "../../api/games";
import GameGrid from "./GameGrid";

type Props = {
  title: string;
  data?: Game[];
};

export default function GameSection({ title, data }: Props) {
  return (
    <section style={{ marginBottom: "40px" }}>
      <h2>{title}</h2>
      <GameGrid games={data} />
    </section>
  );
}
