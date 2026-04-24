import axios from "axios";

const BASE_URL =
  "https://game-tracker-backend-876198057788.europe-north2.run.app/api";

export type CollectionItem = {
  id: string;
  igdbId: number;
  status: "PLAYING" | "BACKLOG" | "COMPLETED" | "DROPPED";
  user_rating?: number;
  review_notes?: string;
  added_at: string;
  game_title?: string;
  cover_url?: string;
};

export const collectionApi = {
  fetchCollection: async (token: string): Promise<CollectionItem[]> => {
    const res = await axios.get(`${BASE_URL}/collection`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return typeof res.data === "string" ? JSON.parse(res.data) : res.data;
  },

  addToCollection: async (
    igdbId: string,
    token: string,
  ): Promise<CollectionItem> => {
    const res = await axios.post(
      `${BASE_URL}/collection/add`,
      { igdbId },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return res.data;
  },

  updateCollectionItem: async (
    igdbId: string,
    updates: Partial<
      Pick<CollectionItem, "status" | "user_rating" | "review_notes">
    >,
    token: string,
  ): Promise<void> => {
    await axios.patch(`${BASE_URL}/collection/${igdbId}`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  removeFromCollection: async (
    igdbId: string,
    token: string,
  ): Promise<void> => {
    await axios.delete(`${BASE_URL}/collection/${igdbId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
