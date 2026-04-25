package com.example.gametracker.service;

import com.example.gametracker.model.*;
import com.example.gametracker.repository.CollectionEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CollectionEntryService {

    private final CollectionEntryRepository entryRepository;
    private final CollectionService collectionService;
    private final UserGameService userGameService;

    @Transactional
    public CollectionEntry add(String userId, UUID collectionId, Integer igdbId) {

        UserGame userGame = userGameService.getOrCreate(userId, igdbId);
        Collection collection = collectionService.get(collectionId);

        if (entryRepository.existsByCollectionIdAndUserGameId(collectionId, userGame.getId())) {
            throw new RuntimeException("Already in collection");
        }

        return entryRepository.save(
                CollectionEntry.builder()
                        .collection(collection)
                        .userGame(userGame)
                        .build()
        );
    }

    @Transactional
    public void remove(UUID collectionId, UUID userGameId) {
        entryRepository.deleteByCollectionIdAndUserGameId(collectionId, userGameId);
    }
}