import { Check, Edit2, Loader2, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
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

  const handleUpdateSave = async (collectionId: string) => {
    const name = editingName.trim();
    if (!name) return;
    await updateMutation.mutateAsync({ collectionId, updates: { name } });
    setEditingId(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-6 gap-2">
        <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          Syncing
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 pb-4">
      <form onSubmit={handleCreate} className="relative group">
        <input
          type="text"
          placeholder="New collection name..."
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          className="
                w-full
                py-4 pl-4 pr-16
                rounded-2xl 
                bg-[#a855f7]/5 
                border border-[#a855f7]/20 
                outline-none 
                focus:bg-[#a855f7]/10
                focus:border-[#a855f7]/60 
                focus:shadow-[0_0_30px_rgba(168,85,247,0.15)]
                transition-all duration-300
                backdrop-blur-xl
                placeholder:text-zinc-600"
        />
        <button
          type="submit"
          disabled={createMutation.isPending || !newCollectionName.trim()}
          className="absolute right-2 top-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all disabled:opacity-0 disabled:scale-90 shadow-lg shadow-purple-500/20"
        >
          {createMutation.isPending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Plus size={18} />
          )}
        </button>
      </form>

      <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
        {collections?.map((collection) => {
          const isEditing = editingId === collection.id;
          const isPendingDelete = deleteConfirm === collection.id;

          return (
            <div
              key={collection.id}
              className={`group flex items-center justify-between px-3 py-2.5 border border-purple-500/20 rounded-xl transition-all bg-purple-600/ text-white border-purple-500/20"
              }`}
            >
              {isEditing ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="
                    w-full
                    px-3 py-2 flex-1
                    rounded-xl 
                    bg-[#a855f7]/5 
                    text-xs
                    border border-[#a855f7]/20 
                    outline-none 
                    focus:bg-[#a855f7]/10
                    focus:border-[#a855f7]/60 
                    focus:shadow-[0_0_30px_rgba(168,85,247,0.15)]
                    transition-all duration-300
                    backdrop-blur-xl
                    placeholder:text-zinc-600"
                    autoFocus
                  />
                  <button
                    onClick={() => handleUpdateSave(collection.id)}
                    className="p-1.5 text-emerald-500 hover:bg-emerald-500/20 rounded-lg transition-colors"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-1.5 text-zinc-500 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                        isPendingDelete
                          ? "bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.3)]"
                          : "bg-zinc-700 group-hover:bg-purple-500"
                      }`}
                    />
                    <span className="text-xs font-bold text-purple-500 group-hover:text-purple-600 delay-300-ease transition-colors">
                      {collection.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {isPendingDelete ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => deleteMutation.mutate(collection.id)}
                          className="px-2 py-1 text-[10px] font-bold text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-2 py-1 text-[10px] font-bold text-zinc-400 hover:bg-zinc-700 transition-colors border-l border-red-500/20"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(collection.id);
                            setEditingName(collection.name);
                          }}
                          disabled={collection.isLocked}
                          className="p-2 text-zinc-600 hover:text-white hover:bg-zinc-800 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:hidden"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(collection.id)}
                          disabled={collection.isLocked}
                          className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:hidden"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}

        {(!collections || collections.length === 0) && (
          <div className="py-8 text-center border border-dashed border-zinc-800 rounded-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
              Empty Library
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
