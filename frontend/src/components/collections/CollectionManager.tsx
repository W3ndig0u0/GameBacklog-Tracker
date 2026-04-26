import { Edit2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Collection } from "../../api/collections/collections";
import {
  useCollections,
  useCreateCollection,
  useDeleteCollection,
  useUpdateCollection,
} from "../../hooks/collections/useCollections";

export default function CollectionManager() {
  const { data: collections, isLoading } = useCollections();
  const createMutation = useCreateCollection();
  const updateMutation = useUpdateCollection();
  const deleteMutation = useDeleteCollection();

  const [newCollectionName, setNewCollectionName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();

    const name = newCollectionName.trim();
    if (!name) return;

    await createMutation.mutateAsync(name);
    setNewCollectionName("");
  };

  const handleUpdateStart = ({ id, name }: Collection) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleUpdateSave = async (collectionId: string) => {
    const name = editingName.trim();
    if (!name) return;

    await updateMutation.mutateAsync({ collectionId, updates: { name } });
    setEditingId(null);
    setEditingName("");
  };

  const handleDelete = async (collectionId: string) => {
    await deleteMutation.mutateAsync(collectionId);
    setDeleteConfirm(null);
  };

  if (isLoading) {
    return (
      <div className="p-4 text-xs uppercase tracking-widest opacity-50 text-white text-center">
        Loading collections...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          type="text"
          placeholder="New collection name..."
          value={newCollectionName}
          onChange={(event) => setNewCollectionName(event.target.value)}
          className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
        />
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
        >
          <Plus size={16} />
          Create
        </button>
      </form>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {collections && collections.length > 0 ? (
          collections.map((collection) => {
            const isEditing = editingId === collection.id;
            const isPendingDelete = deleteConfirm === collection.id;

            return (
              <div
                key={collection.id}
                className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-purple-500/50 transition-colors"
              >
                {isEditing ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(event) => setEditingName(event.target.value)}
                      className="flex-1 px-2 py-1 bg-zinc-700 border border-zinc-600 rounded text-white focus:outline-none focus:border-purple-500"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleUpdateSave(collection.id)}
                      disabled={updateMutation.isPending}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">
                        {collection.name}
                      </h3>
                      {collection.description && (
                        <p className="text-xs text-zinc-400">
                          {collection.description}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateStart(collection)}
                        disabled={collection.isLocked}
                        title={
                          collection.isLocked ? "Collection is locked" : "Edit"
                        }
                        className="p-2 hover:bg-zinc-700 rounded text-zinc-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Edit2 size={16} />
                      </button>

                      {isPendingDelete ? (
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleDelete(collection.id)}
                            disabled={deleteMutation.isPending}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded disabled:opacity-50"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(collection.id)}
                          disabled={collection.isLocked}
                          title={
                            collection.isLocked
                              ? "Collection is locked"
                              : "Delete"
                          }
                          className="p-2 hover:bg-zinc-700 rounded text-zinc-300 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-zinc-400">
            No collections yet. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
}
