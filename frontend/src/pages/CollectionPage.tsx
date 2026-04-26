import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import CollectionManager from "../components/collections/CollectionManager";
import { GameCardWrapper } from "../components/games/GameCardWrapper";
import { useCollections } from "../hooks/collections/useCollections";
import { useGamesLibrary } from "../hooks/library/useCollection";

export const CollectionPage = () => {
  const { user } = useAuth0();
  const { data: library, isLoading: libraryLoading } = useGamesLibrary();
  const { data: collections } = useCollections();
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);
  const [showManager, setShowManager] = useState(false);

  if (libraryLoading) {
    return (
      <div className="p-8 text-xs uppercase tracking-widest opacity-50 text-white text-center">
        Loading Library...
      </div>
    );
  }

  const selectedCollection = collections?.find(
    (c) => c.id === selectedCollectionId,
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h3 className="text-white text-2xl md:text-4xl font-black uppercase italic tracking-tighter mb-4 md:mb-6">
          {user?.name || "My"} Collections
        </h3>

        <div className="bg-zinc-900/50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-white font-semibold">Manage Collections</h4>
            <button
              onClick={() => setShowManager(!showManager)}
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              {showManager ? "Hide" : "Show"}
            </button>
          </div>
          {showManager && <CollectionManager />}
        </div>

        {collections && collections.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedCollectionId(null)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedCollectionId === null
                  ? "bg-purple-600 text-white"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              All Games ({library?.length || 0})
            </button>

            {collections.map((collection) => {
              return (
                <button
                  key={collection.id}
                  onClick={() => setSelectedCollectionId(collection.id)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selectedCollectionId === collection.id
                      ? "bg-purple-600 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {collection.name}
                </button>
              );
            })}
          </div>
        )}

        {selectedCollection && (
          <div className="bg-zinc-800/50 rounded-lg p-3 mb-6">
            <p className="text-white font-semibold">
              {selectedCollection.name}
            </p>
            {selectedCollection.description && (
              <p className="text-zinc-400 text-sm">
                {selectedCollection.description}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
        {library && library.length > 0 ? (
          library.map((item) => (
            <div key={item.id}>
              <GameCardWrapper igdbId={item.igdbId.toString()} />
              <div className="mt-2 space-y-1 text-xs">
                <p className="text-zinc-300">
                  <span className="text-zinc-500">Status:</span> {item.status}
                </p>
                {item.reviewNotes && (
                  <p className="text-zinc-400 truncate">
                    <span className="text-zinc-500">Note:</span>{" "}
                    {item.reviewNotes}
                  </p>
                )}
                <p className="text-zinc-400">
                  <span className="text-zinc-500">Favorite:</span>{" "}
                  {item.isFavorite ? "⭐ Yes" : "No"}
                </p>
                {item.addedAt && (
                  <p className="text-zinc-500">{item.addedAt.slice(0, 10)}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center w-full py-12 text-zinc-400">
            No games in your library yet
          </div>
        )}
      </div>
    </div>
  );
};
