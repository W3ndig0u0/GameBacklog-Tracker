import { useState } from "react";
import { useSearchGames } from "../hooks/useSearchGames";

export default function Search() {
  const [query, setQuery] = useState("");

  const { data, isLoading, isError } = useSearchGames(query);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Search Games</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a game..."
        style={{
          padding: "10px",
          width: "300px",
          marginBottom: "20px",
        }}
      />

      {isLoading && query && <p>Loading...</p>}
      {isError && <p>Error loading games</p>}

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {data?.map((game) => (
          <div key={game.id} style={{ width: "150px" }}>
            <img
              width="150"
              src={
                game.cover?.url
                  ? "https:" + game.cover.url.replace("t_thumb", "t_cover_big")
                  : ""
              }
              alt={game.name}
            />
            <p>{game.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
