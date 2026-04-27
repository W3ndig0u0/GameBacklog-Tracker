import { X } from "lucide-react";
import { useState } from "react";
import type { Collection } from "../../api/collections/collections";
import {
  useAddGameToCollection,
  useCollections,
  useCreateCollection,
} from "../../hooks/collections/useCollections";

interface GameCollectionModalProps {
  open: boolean;
  gameId: string;
  gameName: string;
  onClose: () => void;
}

export default function GameCollectionModal({
  open,
  gameId,
  gameName,
  onClose,
}: GameCollectionModalProps) {
  const { data: collections, isLoading } = useCollections();
  const createCollection = useCreateCollection();
  const addGameToCollection = useAddGameToCollection();
  const [newCollectionName, setNewCollectionName] = useState("");

  const handleClose = () => {
    setNewCollectionName("");
    onClose();
  };

  if (!open) return null;

  const handleCreateCollection = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const name = newCollectionName.trim();
    if (!name) return;

    const created = await createCollection.mutateAsync(name);
    await addGameToCollection.mutateAsync({
      collectionId: created.id,
      igdbId: Number(gameId),
    });
    setNewCollectionName("");
    handleClose();
  };

  const handleAddToCollection = async (collection: Collection) => {
    await addGameToCollection.mutateAsync({
      collectionId: collection.id,
      igdbId: Number(gameId),
    });
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          aria-label="Close collection modal"
        >
          <X size={18} />
        </button>

        <div className="border-b border-zinc-800 p-6">
          <p className="text-sm font-medium text-zinc-400">Add to Collection</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">{gameName}</h2>
        </div>

        <div className="grid gap-8 p-6 md:grid-cols-2">
          {/* Left Column: Existing Collections */}
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-medium text-white">
                Your Collections
              </h3>
              <p className="text-sm text-zinc-400">
                Pick a collection to add this game.
              </p>
            </div>

            {isLoading ? (
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-sm text-zinc-400">
                Loading collections...
              </div>
            ) : collections && collections.length > 0 ? (
              <div className="max-h-[260px] space-y-1 overflow-y-auto pr-2">
                {collections.map((collection) => (
                  <button
                    type="button"
                    key={collection.id}
                    onClick={() => handleAddToCollection(collection)}
                    disabled={addGameToCollection.isPending}
                    className="group flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors hover:bg-zinc-800 disabled:opacity-50"
                  >
                    <span className="font-medium text-zinc-200 group-hover:text-white">
                      {collection.name}
                    </span>
                    <span className="text-xs font-medium text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100">
                      Add
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-zinc-800 p-4 text-sm text-zinc-400">
                No collections yet. Create one below.
              </div>
            )}
          </div>

          {/* Right Column: Create New */}
          <div className="flex flex-col gap-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
            <div>
              <h3 className="text-sm font-medium text-white">Create New</h3>
              <p className="text-sm text-zinc-400">
                Make a new collection and add this game.
              </p>
            </div>

            <form
              onSubmit={handleCreateCollection}
              className="mt-auto flex flex-col gap-3"
            >
              <input
                type="text"
                value={newCollectionName}
                onChange={(event) => setNewCollectionName(event.target.value)}
                placeholder="Collection name..."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              />
              <button
                type="submit"
                disabled={
                  createCollection.isPending ||
                  addGameToCollection.isPending ||
                  !newCollectionName.trim()
                }
                className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200 disabled:opacity-50"
              >
                Create and add
              </button>
            </form>

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
