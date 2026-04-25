import axios from "axios";
import { normalizeArray } from "./normalize";

const BASE_URL =
  "https://game-tracker-backend-876198057788.europe-north2.run.app/api";

export type Collection = {
  id: string;
  name: string;
  description?: string;
  isLocked: boolean;
  createdAt: string;
};

export type CollectionEntry = {
  id: string;
  collectionId: string;
  userGameId: string;
  addedAt: string;
};

export const collectionsApi = {
  getAll: async (token: string): Promise<Collection[]> => {
    const res = await axios.get(`${BASE_URL}/collections`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return normalizeArray<Collection>(res.data);
  },

  create: async (name: string, token: string): Promise<Collection> => {
    const res = await axios.post(
      `${BASE_URL}/collections`,
      { name }, // FIXED
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return res.data;
  },

  addGame: async (
    collectionId: string,
    igdbId: number,
    token: string,
  ): Promise<CollectionEntry> => {
    const res = await axios.post(
      `${BASE_URL}/collections/${collectionId}/games`,
      igdbId,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return res.data;
  },

  removeGame: async (
    collectionId: string,
    gameId: string,
    token: string,
  ): Promise<void> => {
    await axios.delete(
      `${BASE_URL}/collections/${collectionId}/games/${gameId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  },
};
