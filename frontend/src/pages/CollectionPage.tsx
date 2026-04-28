import { useAuth0 } from "@auth0/auth0-react";
import { FolderRoot, Settings2 } from "lucide-react";
import { useMemo, useState } from "react";
import CollectionManager from "../components/collections/CollectionManager";
import { GameCardWrapper } from "../components/games/GameCardWrapper";

import {
  useCollectionGameCounts,
  useCollectionGameIds,
  useCollections,
} from "../hooks/collections/useCollections";

import { useGamesLibrary } from "../hooks/library/useCollection";

const STATUS_COLORS = {
  BACKLOG: "bg-purple-500 shadow-purple-500/80",
  PLAYING: "bg-blue-500 shadow-blue-500/80",
  COMPLETED: "bg-emerald-500 shadow-emerald-500/80",
  DROPPED: "bg-red-500 shadow-red-500/80",
} as const;

const STATUS_ORDER = {
  PLAYING: 0,
  COMPLETED: 1,
  BACKLOG: 2,
  DROPPED: 3,
} as const;

export const CollectionPage = () => {
  const { user } = useAuth0();
  const { data: library, isLoading: libraryLoading } = useGamesLibrary();
  const { data: collections } = useCollections();
  const { counts: collectionCounts } = useCollectionGameCounts(collections);

  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);

  const [showManager, setShowManager] = useState(false);

  const { data: selectedCollectionGameIds, isLoading: selectedGamesLoading } =
    useCollectionGameIds(selectedCollectionId);

  const visibleLibrary = useMemo(() => {
    const baseList = selectedCollectionId
      ? (library?.filter((item) =>
          selectedCollectionGameIds?.includes(Number(item.igdbId)),
        ) ?? [])
      : (library ?? []);

    return [...baseList].sort((a, b) => {
      if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;

      const timeA = new Date(a.addedAt).getTime();
      const timeB = new Date(b.addedAt).getTime();
      if (timeA !== timeB) return timeB - timeA;
      const orderA = STATUS_ORDER[a.status as keyof typeof STATUS_ORDER] ?? 99;
      const orderB = STATUS_ORDER[b.status as keyof typeof STATUS_ORDER] ?? 99;
      return orderA - orderB;
    });
  }, [library, selectedCollectionGameIds, selectedCollectionId]);

  const selectedCollection = collections?.find(
    (c) => c.id === selectedCollectionId,
  );

  if (libraryLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="text-sm font-bold uppercase tracking-widest text-zinc-500 animate-pulse">
          Loading Library...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="sticky top-6 flex flex-col gap-4">
            <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-md shadow-2xl">
              <div className="flex items-center justify-between p-5 pb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold tracking-tight text-zinc-100">
                    {user?.name ? `${user.name}'s` : "My"} Library
                  </h3>
                </div>

                <button
                  onClick={() => setShowManager(!showManager)}
                  className={`p-2 rounded-lg transition-colors ${
                    showManager
                      ? "bg-purple-600 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100"
                  }`}
                  title="Manage Collections"
                >
                  <Settings2 size={18} />
                </button>
              </div>

              {showManager && <CollectionManager />}

              <nav className="p-3">
                <div className="flex flex-col gap-1">
                  {(() => {
                    const isActive = selectedCollectionId === null;
                    return (
                      <button
                        onClick={() => setSelectedCollectionId(null)}
                        className={`group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          isActive
                            ? "bg-purple-600/10 text-white border border-purple-500/20"
                            : "text-zinc-400 hover:bg-purple-500/40 hover:text-zinc-200"
                        }`}
                      >
                        <div className="flex items-center gap-5">
                          <FolderRoot
                            size={16}
                            className={
                              isActive ? "text-purple-500" : "text-zinc-500"
                            }
                          />
                          <span>All Games</span>
                        </div>
                        <span
                          className={`ml-4 px-2 py-0.5 rounded-full text-[10px] font-bold text-center transition-colors ${
                            isActive
                              ? "bg-purple-600 text-white"
                              : "bg-zinc-800 text-zinc-200"
                          }`}
                        >
                          {library?.length || 0}
                        </span>
                      </button>
                    );
                  })()}

                  <div className="my-2 mt-2 h-px bg-zinc-800/50 mx-4" />

                  {collections
                    ?.slice()
                    .sort((a, b) => {
                      const countA = collectionCounts[a.id] || 0;
                      const countB = collectionCounts[b.id] || 0;
                      if (countA !== countB) {
                        return countB - countA;
                      }
                      return a.name.localeCompare(b.name);
                    })
                    .map((collection) => {
                      const isActive = selectedCollectionId === collection.id;
                      const count = collectionCounts[collection.id] || 0;

                      return (
                        <button
                          key={collection.id}
                          onClick={() => setSelectedCollectionId(collection.id)}
                          className={`group mt-1 flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            isActive
                              ? "bg-purple-600/10 text-white border border-purple-500/20"
                              : "text-zinc-400 hover:bg-purple-500/40 hover:text-zinc-200"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                isActive
                                  ? "bg-purple-600 scale-110"
                                  : "bg-zinc-700 group-hover:bg-zinc-500"
                              }`}
                            />
                            <span>{collection.name}</span>
                          </div>

                          <span
                            className={`ml-4 px-2 py-0.5 rounded-full text-[10px] font-bold text-center transition-colors ${
                              isActive
                                ? "bg-purple-600 text-white"
                                : "bg-zinc-800 text-zinc-200"
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </nav>
            </div>

            <div className="px-2">
              <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">
                Cloud Sync Active
              </p>
            </div>
          </div>
        </aside>
        <main className="lg:col-span-3 ">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-white text-2xl md:text-3xl font-black uppercase italic tracking-tighter shrink-0 text-start">
                {selectedCollection ? selectedCollection.name : "My Library"}
              </h2>

              <p className="text-zinc-400 text-sm mt-1 font-medium italic">
                Sorted by Favorites & Recent activity
              </p>
            </div>

            <div className="flex items-center gap-4 bg-zinc-800/50 px-4 py-2 rounded-xl border border-zinc-800">
              <div className="text-sm font-bold text-zinc-400">Total Games</div>

              <div className="text-xl font-black text-white leading-none">
                {visibleLibrary.length}
              </div>
            </div>
          </div>

          {selectedCollectionId && selectedGamesLoading ? (
            <div className="rounded-2xl border border-zinc-800 border-dashed p-20 text-center text-zinc-500">
              Fetching collection games...
            </div>
          ) : visibleLibrary.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5 lg:gap-6">
              {visibleLibrary.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-2 sm:p-3 flex flex-col gap-2 justify-center items-center"
                >
                  <GameCardWrapper igdbId={item.igdbId.toString()} />

                  <div className="flex items-center gap-2.5">
                    <span
                      className={`h-2.5 w-2.5 rounded-full shadow-sm ${STATUS_COLORS[item.status as keyof typeof STATUS_COLORS] || STATUS_COLORS.BACKLOG}`}
                    />

                    <div className="space-y-0.5">
                      <div className="text-[13px] text-zinc-200 font-black uppercase tracking-wider">
                        {item.status}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-around items-center w-full">
                    <div className="text-zinc-500 font-medium italic text-[12px]">
                      {item.addedAt?.slice(0, 10)}
                    </div>

                    <div className="text-right">
                      {item.isFavorite ? (
                        <span className="inline-flex text-[9px] items-center gap-1 text-amber-400 font-bold bg-amber-400/10 px-1 py-1 rounded-lg">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Fav
                        </span>
                      ) : (
                        <span className="text-zinc-600 uppercase tracking-widest text-[9px] font-bold rounded-lg text-s">
                          Standard
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-zinc-800 p-16 text-center">
              <h3 className="text-xl font-bold text-white mb-2">
                No games found
              </h3>

              <p className="text-zinc-500">
                Try adding some games to this collection to get started.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
