import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { usersApi, type GameViewPayload, type UserProfile } from "../../api/users/users";

export const useUserProfile = (auth0Sub: string) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: ["users", "profile", auth0Sub],
    enabled: isAuthenticated && !!auth0Sub,
    queryFn: async () =>
      usersApi.getById(auth0Sub, await getAccessTokenSilently()),
  });
};

export const useUserProfiles = (auth0Subs: string[]) => {
const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const uniqueSubs = Array.from(new Set(auth0Subs.filter(Boolean)));

  const queries = useQueries({
    queries: uniqueSubs.map((auth0Sub) => ({
      queryKey: ["users", "profile", auth0Sub],
      enabled: isAuthenticated && !!auth0Sub,
      queryFn: async () => usersApi.getById(auth0Sub, await getAccessTokenSilently()),
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