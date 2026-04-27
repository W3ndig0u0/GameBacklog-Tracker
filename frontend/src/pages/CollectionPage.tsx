import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import CollectionManager from "../components/collections/CollectionManager";
import { GameCardWrapper } from "../components/games/GameCardWrapper";
import {
  useCollectionGameIds,
  useCollections,
} from "../hooks/collections/useCollections";
import { useGamesLibrary } from "../hooks/library/useCollection";

export const CollectionPage = () => {
  const { user } = useAuth0();
  const { data: library, isLoading: libraryLoading } = useGamesLibrary();
  const { data: collections } = useCollections();
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);
  const [showManager, setShowManager] = useState(false);
  const { data: selectedCollectionGameIds, isLoading: selectedGamesLoading } =
    useCollectionGameIds(selectedCollectionId);

  if (libraryLoading) {
    return (
      <div className="p-8 text-sm uppercase tracking-widest opacity-60 text-white text-center">
        Loading Library...
      </div>
    );
  }

  const selectedCollection = collections?.find(
    (c) => c.id === selectedCollectionId,
  );
  const visibleLibrary = selectedCollectionId
    ? (library?.filter((item) =>
        selectedCollectionGameIds?.includes(Number(item.igdbId)),
      ) ?? [])
    : (library ?? []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <div className="sticky top-6 space-y-6">
            <div className="rounded-2xl bg-zinc-900/60 p-5 shadow-lg">
              <h3 className="text-white text-xl font-extrabold tracking-tight">
                {user?.name ? `${user.name}'s` : "My"} Collections
              </h3>
              <p className="mt-2 text-zinc-400 text-sm">
                Organize your games into collections for easier discovery.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => setShowManager(!showManager)}
                  className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-purple-600 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:opacity-95"
                >
                  {showManager ? "Close Manager" : "Manage"}
                </button>
                <button
                  onClick={() => setSelectedCollectionId(null)}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                >
                  All ({library?.length || 0})
                </button>
              </div>
            </div>

            {showManager && (
              <div className="rounded-2xl bg-zinc-900/50 p-4">
                <CollectionManager />
              </div>
            )}

            <div className="rounded-2xl bg-zinc-900/40 p-4">
              <h4 className="text-zinc-200 font-semibold mb-3">Collections</h4>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSelectedCollectionId(null)}
                  className={`text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                    selectedCollectionId === null
                      ? "bg-purple-600 text-white"
                      : "bg-transparent text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  All Games ({library?.length || 0})
                </button>

                {collections && collections.length > 0 ? (
                  collections.map((collection) => (
                    <button
                      key={collection.id}
                      onClick={() => setSelectedCollectionId(collection.id)}
                      className={`text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                        selectedCollectionId === collection.id
                          ? "bg-purple-600 text-white"
                          : "bg-transparent text-zinc-300 hover:bg-zinc-800"
                      }`}
                    >
                      {collection.name}
                    </button>
                  ))
                ) : (
                  <div className="text-zinc-500 text-sm">
                    No collections yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="md:col-span-3">
          <div className="rounded-2xl bg-zinc-900/50 p-6 mb-6">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                  {selectedCollection ? selectedCollection.name : "All Games"}
                </h2>
                {selectedCollection?.description && (
                  <p className="mt-2 text-zinc-400">
                    {selectedCollection.description}
                  </p>
                )}
                {selectedCollectionId && (
                  <p className="mt-2 text-sm text-zinc-500">
                    {selectedGamesLoading
                      ? "Loading collection games..."
                      : `${visibleLibrary.length} game${visibleLibrary.length === 1 ? "" : "s"} in this collection`}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm text-zinc-400">Library</div>
                  <div className="text-lg font-bold text-white">
                    {library?.length || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {selectedCollectionId && selectedGamesLoading ? (
            <div className="rounded-2xl bg-zinc-900/50 p-12 text-center text-zinc-400">
              Loading collection...
            </div>
          ) : visibleLibrary.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {visibleLibrary.map((item) => (
                <div key={item.id}>
                  <div className="rounded-xl border border-zinc-800/70 bg-zinc-900/40 p-3">
                    <GameCardWrapper igdbId={item.igdbId.toString()} />
                    <div className="mt-3 flex items-center justify-between text-xs text-zinc-300">
                      <div className="space-y-0.5">
                        <div className="text-green-400">{item.status}</div>
                        {item.addedAt && (
                          <div className="text-zinc-500">
                            {item.addedAt.slice(0, 10)}
                          </div>
                        )}
                      </div>
                      <div className="text-right text-sm text-amber-400">
                        {item.isFavorite ? "★ Favorite" : ""}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-zinc-900/50 p-12 text-center">
              <h3 className="text-xl font-bold text-white mb-2">
                {selectedCollectionId
                  ? "No games in this collection"
                  : "No games in your library"}
              </h3>
              <p className="text-zinc-400 mb-6">
                {selectedCollectionId
                  ? "Add games to this collection from a game page to see them here."
                  : "Add games from their pages to build your collection."}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
