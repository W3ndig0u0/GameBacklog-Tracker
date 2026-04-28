import axios from "axios";
import type { Collection } from "../collections/collections";
import type { UserGame } from "../library/userGame";
import type { Review } from "../reviews/review";
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
  getMe: async (token: string): Promise<UserProfile> => {
    const res = await axios.get(`${BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  getById: async (auth0Sub: string, token?: string): Promise<UserProfile> => {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const res = await axios.get(
      `${BASE_URL}/users/${encodeURIComponent(auth0Sub)}`,
      headers ? { headers } : undefined,
    );
    return res.data;
  },

  getCollections: async (auth0Sub: string): Promise<Collection[]> => {
    const res = await axios.get(
      `${BASE_URL}/users/${encodeURIComponent(auth0Sub)}/collections`,
    );

    return normalizeArray<Collection>(res.data);
  },

  getReviews: async (auth0Sub: string): Promise<Review[]> => {
    const res = await axios.get(
      `${BASE_URL}/users/${encodeURIComponent(auth0Sub)}/reviews`,
    );

    return normalizeArray<Review>(res.data);
  },

  getLibrary: async (auth0Sub: string): Promise<UserGame[]> => {
    const res = await axios.get(
      `${BASE_URL}/users/${encodeURIComponent(auth0Sub)}/library`,
    );

    return normalizeArray<UserGame>(res.data);
  },
  
  getMyHistory: async (token: string): Promise<GameViewHistory[]> => {
    const res = await axios.get(`${BASE_URL}/users/me/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return normalizeArray<GameViewHistory>(res.data);
  },

  getHistory: async (auth0Sub: string): Promise<GameViewHistory[]> => {
    const res = await axios.get(
      `${BASE_URL}/users/${encodeURIComponent(auth0Sub)}/history`,
    );

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