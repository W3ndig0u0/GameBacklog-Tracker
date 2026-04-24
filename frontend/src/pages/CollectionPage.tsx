import { useAuth0 } from "@auth0/auth0-react";
import { GameCardWrapper } from "../components/games/GameCardWrapper";
import { useCollection } from "../hooks/useCollection";

export const CollectionPage = () => {
  const { user } = useAuth0();
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
      <h3 className="text-white text-2xl md:text-4xl font-black uppercase italic tracking-tighter mb-6 md:mb-10">
        {user?.name || "My"} Collection
      </h3>
      <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
        {collection?.map((item) => (
          <div key={item.id}>
            <GameCardWrapper igdbId={item.igdbId.toString()} />
            <p>Status: {item.status}</p>
            <p>Review: {item.reviewNotes}</p>
            <p>Status: {item.status}</p>
            <p>Favorite: {item.isFavorite ? "Yes" : "No"}</p>
            <p>Added: {item.addedAt.slice(0, 10)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
