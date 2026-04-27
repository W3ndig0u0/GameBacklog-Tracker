import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
    reviewsApi,
    type Review,
    type ReviewPayload,
    type ReviewUpdatePayload,
} from "../../api/reviews/review";

export const useMyReviews = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: ["reviews", "me"],
    enabled: isAuthenticated,
    queryFn: async () => reviewsApi.getMine(await getAccessTokenSilently()),
  });
};

export const useGameReviews = (igdbId: number) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: ["reviews", "game", igdbId],
    enabled: isAuthenticated && !!igdbId,
    queryFn: async () => reviewsApi.getByGame(igdbId, await getAccessTokenSilently()),
  });
};

export const useCreateOrUpdateReview = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ReviewPayload) =>
      reviewsApi.createOrUpdate(payload, await getAccessTokenSilently()),
    onSuccess: (savedReview: Review) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", "me"] });
      queryClient.invalidateQueries({
        queryKey: ["reviews", "game", savedReview.igdbId],
      });
      toast.success("Review saved!");
    },
    onError: () => {
      toast.error("Failed to save review");
    },
  });
};

export const useUpdateReview = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      igdbId,
      updates,
    }: {
      igdbId: number;
      updates: ReviewUpdatePayload;
    }) => reviewsApi.update(igdbId, updates, await getAccessTokenSilently()),
    onSuccess: (updatedReview: Review) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", "me"] });
      queryClient.invalidateQueries({
        queryKey: ["reviews", "game", updatedReview.igdbId],
      });
      toast.success("Review updated!");
    },
    onError: () => {
      toast.error("Failed to update review");
    },
  });
};

export const useDeleteReview = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (igdbId: number) => {
      const token = await getAccessTokenSilently();
      await reviewsApi.remove(igdbId, token);
      return igdbId;
    },
    onSuccess: (igdbId: number) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", "me"] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "game", igdbId] });
      toast.success("Review deleted!");
    },
    onError: () => {
      toast.error("Failed to delete review");
    },
  });
};
