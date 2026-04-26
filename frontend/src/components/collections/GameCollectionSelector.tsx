import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { Collection } from "../../api/collections/collections";
import {
  useAddGameToCollection,
  useCollections,
  useRemoveGameFromCollection,
} from "../../hooks/collections/useCollections";

interface GameCollectionSelectorProps {
  igdbId: string;
  currentCollections?: Collection[];
}

export default function GameCollectionSelector({
  igdbId,
  currentCollections = [],
}: GameCollectionSelectorProps) {
  const { data: allCollections, isLoading } = useCollections();
  const addGameMutation = useAddGameToCollection();
  const removeGameMutation = useRemoveGameFromCollection();
  const [isOpen, setIsOpen] = useState(false);

  const currentCollectionIds = currentCollections.map(
    (collection) => collection.id,
  );

  const handleToggleCollection = async (
    collectionId: string,
    isCurrentlyIn: boolean,
  ) => {
    if (isCurrentlyIn) {
      await removeGameMutation.mutateAsync({ collectionId, gameId: igdbId });
      return;
    }

    await addGameMutation.mutateAsync({
      collectionId,
      igdbId: Number(igdbId),
    });
  };

  if (isLoading) {
    return <div className="text-zinc-400 text-sm">Loading collections...</div>;
  }

  if (!allCollections || allCollections.length === 0) {
    return (
      <div className="text-zinc-400 text-sm">No collections available</div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white hover:border-purple-500 transition-colors"
      >
        <span className="text-sm">
          {currentCollections.length === 0
            ? "Add to collections..."
            : `${currentCollections.length} collection${currentCollections.length !== 1 ? "s" : ""}`}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-zinc-900 border border-zinc-700 rounded-lg shadow-lg z-50">
          {allCollections.map((collection) => {
            const isInCollection = currentCollectionIds.includes(collection.id);

            return (
              <button
                type="button"
                key={collection.id}
                onClick={() =>
                  handleToggleCollection(collection.id, isInCollection)
                }
                disabled={
                  addGameMutation.isPending || removeGameMutation.isPending
                }
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-800 flex items-center gap-2 disabled:opacity-50"
              >
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    isInCollection
                      ? "bg-purple-600 border-purple-600"
                      : "border-zinc-600"
                  }`}
                >
                  {isInCollection && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </div>
                {collection.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
