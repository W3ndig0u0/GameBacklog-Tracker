import { GameCardWrapper } from "../../components/games/GameCardWrapper";
import { SectionTitle } from "./SharedUI";
import type { GameData } from "./types";

export const SimilarGames = ({
  games,
}: {
  games: GameData["similar_games"];
}) => (
  <aside className="lg:col-span-1">
    <div className="text-center lg:text-left">
      <SectionTitle>Similar Games</SectionTitle>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 justify-items-center">
      {games?.slice(0, 10).map((game) => (
        <div key={game.id} className="w-full flex justify-center direction-col">
          <GameCardWrapper igdbId={game.id.toString()} />
        </div>
      ))}
    </div>
  </aside>
);
