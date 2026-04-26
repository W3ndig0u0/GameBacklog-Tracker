import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
      toast.success("Game removed from collection");
    },
    onError: () => {
      toast.error("Failed to remove game from collection");
    },
  });
};