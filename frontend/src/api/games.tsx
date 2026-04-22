import axios from "axios";

const BASE_URL =
  "https://game-tracker-backend-876198057788.europe-north2.run.app/api";

export type Game = {
  id: number;
  name: string;
  cover?: { url: string };
};

export const fetchTrendingGames = async (): Promise<Game[]> => {
  const res = await axios.get(`${BASE_URL}/games/trending`);
  return typeof res.data === "string" ? JSON.parse(res.data) : res.data;
};

export const fetchPopularGames = async (): Promise<Game[]> => {
  const res = await axios.get(`${BASE_URL}/games/popular`);
  return typeof res.data === "string" ? JSON.parse(res.data) : res.data;
};

export const fetchTopRatedGames = async (): Promise<Game[]> => {
  const res = await axios.get(`${BASE_URL}/games/top-rated`);
  return typeof res.data === "string" ? JSON.parse(res.data) : res.data;
};

export const searchGames = async (query: string): Promise<Game[]> => {
  const res = await axios.get<string>(
    `${BASE_URL}/games/search?q=${encodeURIComponent(query)}`,
  );

  return typeof res.data === "string" ? JSON.parse(res.data) : res.data;
};
