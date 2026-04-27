import { Plus, X } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm sm:p-8">
      <div className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-(--border) bg-(--bg) shadow--shadow)]">
        <div className="flex items-center justify-between border-b border-(--border) p-6 sm:p-8">
          <div className="pr-6">
            <h2 className="text-xl font-semibold text-(--text)">
              Add to collection
            </h2>
            <p className="mt-2 truncate text-base text-(--text)">{gameName}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-3 text-(--text) transition-colors hover:bg-(--border) hover:text-(--text)"
          >
            <X size={24} />
          </button>
        </div>

        <div className="border-b border-(--border) bg-(--code-bg) p-6 sm:p-8">
          <form
            onSubmit={handleCreateCollection}
            className="flex items-center gap-4"
          >
            <input
              type="text"
              value={newCollectionName}
              onChange={(event) => setNewCollectionName(event.target.value)}
              placeholder="New collection name..."
              className="flex-1 rounded-xl border border-(--border) bg-(--bg) px-5 py-4 text-base text--text-h)] placeholder--text)] transition-colors focus:border--accent)] focus:outline-none focus:ring-1 focus:ring--accent)]"
            />
            <button
              type="submit"
              disabled={
                createCollection.isPending ||
                addGameToCollection.isPending ||
                !newCollectionName.trim()
              }
              className="flex items-center justify-center rounded-xl bg-(--accent) px-8 py-4 text-base font-semibold text--bg)] transition-colors hover:opacity-90 disabled:opacity-50"
            >
              Create
            </button>
          </form>
        </div>

        <div className="flex max-h-100 flex-col overflow-y-auto p-4 sm:p-6">
          {isLoading ? (
            <div className="p-8 text-center text-base text-(--text)">
              Loading...
            </div>
          ) : collections && collections.length > 0 ? (
            <div className="flex flex-col gap-3">
              {collections.map((collection) => (
                <button
                  type="button"
                  key={collection.id}
                  onClick={() => handleAddToCollection(collection)}
                  disabled={addGameToCollection.isPending}
                  className="group flex w-full items-center justify-between rounded-xl border border-transparent p-5 text-left transition-colors hover:border-(--accent-border) hover:bg-(--accent-bg) disabled:opacity-50"
                >
                  <span className="text-base font-medium text-(--text-h) group-hover:text-(--accent)">
                    {collection.name}
                  </span>
                  <Plus
                    size={22}
                    className="text-(--text) opacity-0 transition-opacity group-hover:text-(--accent) group-hover:opacity-100"
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-base text-(--text)">
              No collections yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
