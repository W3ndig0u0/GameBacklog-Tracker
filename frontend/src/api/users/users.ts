import axios from "axios";
import { normalizeArray } from "../shared/normalize";

const BASE_URL =
  "https://game-tracker-backend-876198057788.europe-north2.run.app/api";

export type UserProfile = {
  id?: string;
  auth0Sub: string;
  displayName: string;
  pictureUrl?: string | null;
  email?: string | null;
  createdAt?: string | null;
  reviewCount: number;
  collectionCount: number;
  libraryCount: number;
  favoriteCount: number;
};

export type GameViewHistory = {
  id: string;
  userId: string;
  igdbId: number;
  gameName: string;
  coverUrl?: string | null;
  clickedAt: string;
};

export type GameViewPayload = {
  igdbId: number;
  gameName: string;
  coverUrl?: string | null;
};

export const usersApi = {
  getProfile: async (auth0Sub: string, token: string): Promise<UserProfile> => {
    const res = await axios.get(`${BASE_URL}/users/${encodeURIComponent(auth0Sub)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  getMe: async (token: string): Promise<UserProfile> => {
    const res = await axios.get(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  },

  getMyHistory: async (token: string): Promise<GameViewHistory[]> => {
    const res = await axios.get(`${BASE_URL}/users/me/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return normalizeArray<GameViewHistory>(res.data);
  },

  recordHistory: async (
    payload: GameViewPayload,
    token: string,
  ): Promise<GameViewHistory> => {
    const res = await axios.post(`${BASE_URL}/users/me/history`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  },
};