import { GameCardWrapper } from "../components/games/GameCardWrapper";
import { useCollection } from "../hooks/useCollection";

export const CollectionPage = () => {
  const { data: collection, isLoading } = useCollection();
  if (isLoading) {
    return (
      <div className="p-8 text-xs uppercase tracking-widest opacity-50 text-white text-center">
        Loading Library...
      </div>
    );
  }
  console.log(collection);

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <h1 className="text-2xl font-black uppercase tracking-tighter mb-8 text-white">
        My Collection
      </h1>
      <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
        {collection?.map((item) => (
          <div key={item.id}>
            <GameCardWrapper igdbId={item.igdbId.toString()} />
            <p>Status: {item.status}</p>
            <p>Review: {item.reviewNotes}</p>
            <p>Rating: {item.userRating}</p>
            <p>Favorite: {item.isFavorite ? "Yes" : "No"}</p>
            <p>Added: {item.addedAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
