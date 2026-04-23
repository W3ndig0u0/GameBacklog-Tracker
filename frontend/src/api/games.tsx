import axios from "axios";

const BASE_URL =
  "https://game-tracker-backend-876198057788.europe-north2.run.app/api";
export type GameImage = {
  id: number;
  image_id: string;
  url?: string;
};

export type GameTag = {
  id: number;
  name: string;
};

export type Video = {
  id: number;
  video_id: string;
};

export type Company = {
  id: number;
  company: GameTag;
  developer: boolean;
};

export type SimilarGame = {
  id: number;
  name: string;
  cover?: GameImage;
};

export type Game = {
  id: number;
  name: string;
  cover?: GameImage;
  screenshots?: GameImage[];
  artworks?: GameImage[];
  videos?: Video[];

  genres?: GameTag[];
  themes?: GameTag[];
  game_modes?: GameTag[];
  platforms?: GameTag[];

  involved_companies?: Company[];
  similar_games?: SimilarGame[];

  total_rating?: number;
  total_rating_count?: number;
  first_release_date?: number;
  summary?: string;
  storyline?: string;
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

export const fetchGameById = async (id: string): Promise<Game> => {
  const res = await axios.get<string>(`${BASE_URL}/games/${id}`);
  const parsedData =
    typeof res.data === "string" ? JSON.parse(res.data) : res.data;
  return Array.isArray(parsedData) ? parsedData[0] : parsedData;
};
