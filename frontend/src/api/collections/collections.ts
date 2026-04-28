import axios from "axios";
import { normalizeArray } from "../shared/normalize";

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
      { name },
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
      { igdbId },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return res.data;
  },

  getGameIds: async (collectionId: string, token?: string): Promise<number[]> => {
    const res = await axios.get(`${BASE_URL}/collections/${collectionId}/games`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    return res.data;
  },

  removeGame: async (
    collectionId: string,
    igdbId: number,
    token: string,
  ): Promise<void> => {
    await axios.delete(
      `${BASE_URL}/collections/${collectionId}/games/${igdbId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  },

  update: async (
    collectionId: string,
    updates: Partial<Pick<Collection, "name" | "description">>,
    token: string,
  ): Promise<Collection> => {
    const res = await axios.patch(
      `${BASE_URL}/collections/${collectionId}`,
      updates,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return res.data;
  },

  delete: async (collectionId: string, token: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/collections/${collectionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  getById: async (collectionId: string, token: string): Promise<Collection> => {
    const res = await axios.get(`${BASE_URL}/collections/${collectionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};