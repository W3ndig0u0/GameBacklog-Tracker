import { useAuth0 } from "@auth0/auth0-react";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { Collection, CollectionEntry } from "../../api/collections/collections";
import { collectionsApi } from "../../api/collections/collections";

export const useCollections = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: ["collections"],
    enabled: isAuthenticated,
    queryFn: async () => collectionsApi.getAll(await getAccessTokenSilently()),
  });
};

export const useCollection = (collectionId: string) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: ["collections", collectionId],
    enabled: isAuthenticated && !!collectionId,
    queryFn: async () =>
      collectionsApi.getById(collectionId, await getAccessTokenSilently()),
  });
};

export const useCollectionGameIds = (collectionId: string | null) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  return useQuery({
    queryKey: ["collections", collectionId, "game-ids"],
    enabled: isAuthenticated && !!collectionId,
    queryFn: async () =>
      collectionsApi.getGameIds(collectionId as string, await getAccessTokenSilently()),
  });
};

export const useCollectionGameCounts = (collections?: Collection[]) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const queries = useQueries({
    queries: (collections ?? []).map((collection) => ({
      queryKey: ["collections", collection.id, "game-ids"],
      enabled: isAuthenticated && !!collection.id,
      queryFn: async () =>
        collectionsApi.getGameIds(collection.id, await getAccessTokenSilently()),
    })),
  });

const counts = (collections ?? []).reduce<Record<string, number>>((acc, collection, index) => {
    acc[collection.id] = queries[index]?.data?.length ?? 0;
    return acc;
  }, {});
  
  return {
    counts,
    isLoading: queries.some((query) => query.isLoading),
  };
};

export const useCollectionsMembership = (
  collections?: Collection[],
  igdbId?: string | number,
) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const idStr = igdbId?.toString();

  const queries = useQueries({
    queries: (collections ?? []).map((collection) => ({
      queryKey: ["collections", collection.id, "has-game", idStr],
      enabled: isAuthenticated && !!collection.id && !!idStr,
      queryFn: async () =>
        (await collectionsApi.getGameIds(collection.id, await getAccessTokenSilently())).includes(Number(idStr)),
    })),
  });

  const membership = (collections ?? []).reduce<Record<string, boolean>>((acc, collection, index) => {
    acc[collection.id] = queries[index]?.data ?? false;
    return acc;
  }, {});

  return {
    membership,
    isLoading: queries.some((q) => q.isLoading),
  };
};

export const useCreateCollection = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) =>
      collectionsApi.create(name, await getAccessTokenSilently()),
    onSuccess: (newCollection: Collection) => {
      queryClient.setQueryData<Collection[]>(["collections"], (oldData) =>
        oldData ? [...oldData, newCollection] : [newCollection],
      );
      toast.success(`Collection "${newCollection.name}" created!`);
    },
    onError: () => {
      toast.error("Failed to create collection");
    },
  });
};

export const useUpdateCollection = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      collectionId,
      updates,
    }: {
      collectionId: string;
      updates: Partial<Pick<Collection, "name" | "description">>;
    }) =>
      collectionsApi.update(collectionId, updates, await getAccessTokenSilently()),
    onSuccess: (updatedCollection: Collection) => {
      queryClient.setQueryData<Collection>(
        ["collections", updatedCollection.id],
        updatedCollection,
      );

      queryClient.setQueryData<Collection[]>(["collections"], (oldData) =>
        oldData?.map((collection) =>
          collection.id === updatedCollection.id ? updatedCollection : collection,
        ) ?? [],
      );

      toast.success("Collection updated!");
    },
    onError: () => {
      toast.error("Failed to update collection");
    },
  });
};

export const useDeleteCollection = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (collectionId: string) =>
      collectionsApi.delete(collectionId, await getAccessTokenSilently()),
    onSuccess: (_, collectionId: string) => {
      queryClient.setQueryData<Collection[]>(["collections"], (oldData) =>
        oldData?.filter((collection) => collection.id !== collectionId) ?? [],
      );
      queryClient.removeQueries({ queryKey: ["collections", collectionId] });
      toast.success("Collection deleted!");
    },
    onError: () => {
      toast.error("Failed to delete collection");
    },
  });
};

export const useAddGameToCollection = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      collectionId,
      igdbId,
    }: {
      collectionId: string;
      igdbId: number;
    }) =>
      collectionsApi.addGame(collectionId, igdbId, await getAccessTokenSilently()),
    onSuccess: (entry: CollectionEntry) => {
      queryClient.invalidateQueries({
        queryKey: ["collections", entry.collectionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["collections", entry.collectionId, "game-ids"],
      });
      queryClient.invalidateQueries({
        queryKey: ["collections", entry.collectionId, "has-game"],
      });
      toast.success("Game added to collection!");
    },
    onError: () => {
      toast.error("Failed to add game to collection");
    },
  });
};

export const useRemoveGameFromCollection = () => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      collectionId,
      gameId,
    }: {
      collectionId: string;
      gameId: string;
    }) =>
      collectionsApi.removeGame(collectionId, gameId, await getAccessTokenSilently()),
    onSuccess: (_, { collectionId }) => {
      queryClient.invalidateQueries({
        queryKey: ["collections", collectionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["collections", collectionId, "game-ids"],
      });
      queryClient.invalidateQueries({
        queryKey: ["collections", collectionId, "has-game"],
      });
      toast.success("Game removed from collection");
    },
    onError: () => {
      toast.error("Failed to remove game from collection");
    },
  });
};