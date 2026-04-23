import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { collectionApi } from "../api/collection";

export const useCollection = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: ["collection"],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      return collectionApi.fetchCollection(token);
    },
    enabled: isAuthenticated,
  });
};