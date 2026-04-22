import axios from "axios";

const BASE_URL =
  "https://game-tracker-backend-876198057788.europe-north2.run.app/api/games";

export type Game = {
  id: number;
  name: string;
  cover?: { url: string };
};

export const fetchTrendingGames = async (): Promise<Game[]> => {
  const res = await axios.get<string>(`${BASE_URL}/trending`);
  return JSON.parse(res.data);
};

export const fetchPopularGames = async (): Promise<Game[]> => {
  const res = await axios.get<string>(`${BASE_URL}/popular`);
  return JSON.parse(res.data);
};

export const fetchTopRatedGames = async (): Promise<Game[]> => {
  const res = await axios.get<string>(`${BASE_URL}/top-rated`);
  return JSON.parse(res.data);
};
