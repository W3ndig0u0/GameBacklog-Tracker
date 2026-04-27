import axios from "axios";
import { normalizeArray } from "../shared/normalize";

const BASE_URL =
  "https://game-tracker-backend-876198057788.europe-north2.run.app/api";

export type Review = {
  id: number;
  userId: string;
  igdbId: number;
  reviewText: string;
  reviewedAt: string;
  starRating: number;
};

export type ReviewPayload = {
  igdbId: number;
  reviewText: string;
  starRating: number;
};

export type ReviewUpdatePayload = Partial<Pick<ReviewPayload, "reviewText" | "starRating">>;

export const reviewsApi = {
  getMine: async (token: string): Promise<Review[]> => {
    const res = await axios.get(`${BASE_URL}/reviews/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return normalizeArray<Review>(res.data);
  },

  getByGame: async (igdbId: number, token?: string): Promise<Review[]> => {
    const res = await axios.get(`${BASE_URL}/reviews/game/${igdbId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });

    return normalizeArray<Review>(res.data);
  },

  createOrUpdate: async (
    payload: ReviewPayload,
    token: string,
  ): Promise<Review> => {
    const res = await axios.post(`${BASE_URL}/reviews`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  update: async (
    igdbId: number,
    updates: ReviewUpdatePayload,
    token: string,
  ): Promise<Review> => {
    const res = await axios.patch(`${BASE_URL}/reviews/${igdbId}`, updates, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  },

  remove: async (igdbId: number, token: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/reviews/${igdbId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};