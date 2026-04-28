import { useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGameById } from "../../hooks/games/useGameById";
import { useAddGame } from "../../hooks/library/useAddGame";
import { useGamesLibrary } from "../../hooks/library/useCollection";
import { useRemoveFromCollection } from "../../hooks/library/useRemoveFromCollection";
import { useUpdateCollectionItem } from "../../hooks/library/useUpdateCollectionItem";

import { useAuth0 } from "@auth0/auth0-react";
import type { UserGame } from "../../api/library/userGame";
import { useGameReviews } from "../../hooks/review/useReviews";
import { useRecordGameHistory } from "../../hooks/users/useUsers";
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
  const { isAuthenticated, user } = useAuth0();
  const recordGameHistory = useRecordGameHistory();
  const { isPending: isAdding } = useAddGame();
  const { isPending: isRemoving } = useRemoveFromCollection();
  const { data: collection } = useGamesLibrary();
  const { data: g, isLoading } = useGameById(gameId);
  const { mutate: updateGame } = useUpdateCollectionItem();
  const { data: gameReviews } = useGameReviews(Number(gameId));

  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const lastRecordedGameId = useRef<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !g || lastRecordedGameId.current === g.id) {
      return;
    }

    lastRecordedGameId.current = g.id;

    recordGameHistory.mutate({
      igdbId: g.id,
      gameName: g.name,
      coverUrl: g.cover?.url
        ? `https:${g.cover.url.replace("t_thumb", "t_cover_big")}`
        : undefined,
    });
  }, [g, isAuthenticated, recordGameHistory]);

  const myGameData = useMemo(
    () =>
      collection?.find((item: UserGame) => item.igdbId.toString() === gameId),
    [collection, gameId],
  );

  const gameInCollection = !!myGameData;

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
          isEditing={isRemoving}
          myGameData={myGameData}
          isLoggedIn={!!user}
          updateGame={updateGame}
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

          {isAuthenticated ? (
            <ReviewEditor gameId={gameId} />
          ) : (
            <div className="mt-10 p-4 bg-white/5 border border-white/10 rounded-xl text-center text-zinc-400">
              You have to login to leave a review!
            </div>
          )}

          <CommunityActivity reviews={gameReviews} />
        </div>
      </div>

      <Lightbox imgId={lightboxImg} onClose={() => setLightboxImg(null)} />
    </>
  );
};

export default GamePage;
