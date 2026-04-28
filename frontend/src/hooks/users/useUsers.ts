import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { usersApi, type GameViewPayload, type UserProfile } from "../../api/users/users";

export const useUserProfile = (auth0Sub: string) => {
  const { getAccessTokenSilently } = useAuth0();

  return useQuery({
    queryKey: ["users", "profile", auth0Sub],
    enabled: !!auth0Sub,
    queryFn: async () => {
      const token = await getAccessTokenSilently().catch(() => undefined);
      return usersApi.getById(auth0Sub, token);
    },
  });
};

export const useUserProfiles = (auth0Subs: string[]) => {
  const { getAccessTokenSilently } = useAuth0();
  const uniqueSubs = Array.from(new Set(auth0Subs.filter(Boolean)));

  const queries = useQueries({
    queries: uniqueSubs.map((auth0Sub) => ({
      queryKey: ["users", "profile", auth0Sub],
      enabled: !!auth0Sub,
      queryFn: async () => {
        const token = await getAccessTokenSilently().catch(() => undefined);
        return usersApi.getById(auth0Sub, token);
      },
    })),
  });

  const profilesBySub = uniqueSubs.reduce<Record<string, UserProfile | undefined>>(
    (accumulator, auth0Sub, index) => {
      accumulator[auth0Sub] = queries[index]?.data;
      return accumulator;
    },
    {},
  );

  return { profilesBySub, isLoading: queries.some((query) => query.isLoading) };
};

export const useUserCollections = (auth0Sub: string) =>
  useQuery({
    queryKey: ["users", "collections", auth0Sub],
    enabled: !!auth0Sub,
    queryFn: async () => usersApi.getCollections(auth0Sub),
  });

export const useUserReviews = (auth0Sub: string) =>
  useQuery({
    queryKey: ["users", "reviews", auth0Sub],
    enabled: !!auth0Sub,
    queryFn: async () => usersApi.getReviews(auth0Sub),
  });

export const useUserHistory = (auth0Sub: string) =>
  useQuery({
    queryKey: ["users", "history", auth0Sub],
    enabled: !!auth0Sub,
    queryFn: async () => usersApi.getHistory(auth0Sub),
  });

export const useUserLibrary = (auth0Sub: string) =>
  useQuery({
    queryKey: ["users", "library", auth0Sub],
    enabled: !!auth0Sub,
    queryFn: async () => usersApi.getLibrary(auth0Sub),
  });

export const useMyProfile = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: ["users", "me"],
    enabled: isAuthenticated,
    queryFn: async () => usersApi.getMe(await getAccessTokenSilently()),
  });
};

export const useMyGameHistory = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: ["users", "history", "me"],
    enabled: isAuthenticated,
    queryFn: async () => usersApi.getMyHistory(await getAccessTokenSilently()),
  });
};

export const useRecordGameHistory = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: GameViewPayload) =>
      usersApi.recordHistory(payload, await getAccessTokenSilently()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "history", "me"] });
    },
    onError: () => {
      toast.error("Failed to save game history");
    },
  });
};