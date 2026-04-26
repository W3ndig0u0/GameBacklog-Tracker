import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { UserGameApi } from "../../api/library/userGame";

export const useGamesLibrary = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: ["library"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      return UserGameApi.getAll(token);
    },
  });
};