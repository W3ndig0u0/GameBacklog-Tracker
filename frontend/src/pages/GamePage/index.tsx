import { useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useAddGame } from "../../hooks/useAddGame";
import { useCollection } from "../../hooks/useCollection";
import { useGameById } from "../../hooks/useGameById";
import { useRemoveFromCollection } from "../../hooks/useRemoveFromCollection";
import { useUpdateCollectionItem } from "../../hooks/useUpdateCollectionItem";

import type { CollectionItem } from "../../api/library";
import { CommunityActivity } from "./CommunityActivity";
import { GameHero } from "./GameHero";
import { GameMedia } from "./GameMedia";
import { GameStats } from "./GameStats";
import { GameTags } from "./GameTags";
import { Lightbox } from "./Lightbox";
import { ReviewEditor } from "./ReviewEditor";
import { SectionTitle } from "./SharedUI";
import { SimilarGames } from "./SimilarGames";

const GamePage = () => {
  const { gameId } = useParams({ from: "/game/$gameId" });

  const { mutate: addGame, isPending: isAdding } = useAddGame();
  const { mutate: removeGame, isPending: isRemoving } =
    useRemoveFromCollection();
  const { data: collection } = useCollection();
  const { data: g, isLoading } = useGameById(gameId);
  const { mutate: updateGame } = useUpdateCollectionItem();

  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const myGameData = useMemo(
    () =>
      collection?.find(
        (item: CollectionItem) => item.igdbId.toString() === gameId,
      ),
    [collection, gameId],
  );

  const gameInCollection = !!myGameData;

  const handleToggleCollection = () => {
    gameInCollection ? removeGame(gameId) : addGame(gameId);
  };

  if (isLoading || !g) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg text-accent uppercase font-black animate-pulse">
        Loading Game Data...
      </div>
    );
  }

  return (
    <>
      <div className="bg-bg text-text min-h-screen pb-20">
        <GameHero
          g={g}
          gameInCollection={gameInCollection}
          isAdding={isAdding}
          isRemoving={isRemoving}
          onToggle={handleToggleCollection}
        />

        <div className="max-w-6xl mx-auto px-6">
          <GameStats g={g} />
          <GameTags g={g} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
            <div className="lg:col-span-2 space-y-10">
              <section>
                <SectionTitle>Summary</SectionTitle>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  {g.summary}
                </p>
              </section>

              {g.storyline && (
                <section>
                  <SectionTitle>Storyline</SectionTitle>
                  <p className="text-zinc-400 text-lg leading-relaxed">
                    {g.storyline}
                  </p>
                </section>
              )}

              <GameMedia g={g} onImageClick={setLightboxImg} />
            </div>

            <SimilarGames games={g.similar_games} />
          </div>

          {gameInCollection ? (
            <ReviewEditor
              gameId={gameId}
              myGameData={myGameData}
              updateGame={updateGame}
            />
          ) : (
            <div className="mt-10 p-4 bg-white/5 border border-white/10 rounded-xl text-center text-zinc-400">
              You have to add this game to your collection to leave a review.
            </div>
          )}

          <CommunityActivity />
        </div>
      </div>

      <Lightbox imgId={lightboxImg} onClose={() => setLightboxImg(null)} />
    </>
  );
};

export default GamePage;
