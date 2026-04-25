import axios from "axios";

const BASE_URL =
  "https://game-tracker-backend-876198057788.europe-north2.run.app/api";

export type UserGame = {
  id: string;
  igdbId: string;
  status: "PLAYING" | "BACKLOG" | "COMPLETED" | "DROPPED";
  userRating?: number;
  reviewNotes?: string;
  isFavorite?: boolean;
  addedAt: string;
};

export const UserGameApi = {
  getAll: async (token: string): Promise<UserGame[]> => {
    const res = await axios.get(`${BASE_URL}/library`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Array.isArray(res.data) ? res.data : [];
  },

  getByStatus: async (status: string, token: string): Promise<UserGame[]> => {
    const res = await axios.get(`${BASE_URL}/library/status/${status}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Array.isArray(res.data) ? res.data : [];
  },

  update: async (
    igdbId: string,
    updates: Partial<
      Pick<UserGame, "status" | "userRating" | "reviewNotes" | "isFavorite">
    >,
    token: string,
  ): Promise<UserGame> => {
    const res = await axios.patch(`${BASE_URL}/library/${igdbId}`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  remove: async (igdbId: string, token: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/library/${igdbId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  add: async (igdbId: string, token: string): Promise<UserGame> => {
    const res = await axios.post(
      `${BASE_URL}/games/add`,
      { igdbId },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return res.data;
  },
};
