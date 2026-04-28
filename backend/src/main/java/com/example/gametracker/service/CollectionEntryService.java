package com.example.gametracker.service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.gametracker.model.CollectionEntry;
import com.example.gametracker.model.GameCollection;
import com.example.gametracker.model.UserGame;
import com.example.gametracker.repository.CollectionEntryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CollectionEntryService {

    private final CollectionEntryRepository entryRepository;
    private final CollectionService collectionService;
    private final UserGameService userGameService;

    @Transactional
    public CollectionEntry add(String userId, UUID collectionId, Integer igdbId) {

        UserGame userGame = userGameService.getOrCreate(userId, igdbId);
        GameCollection collection = collectionService.get(collectionId);

        if (entryRepository.existsByCollectionIdAndUserGameId(collectionId, userGame.getId())) {
            throw new RuntimeException("Already in collection");
        }

        return entryRepository.save(
                CollectionEntry.builder()
                        .collection(collection)
                        .userGame(userGame)
                        .build());
    }

    @Transactional(readOnly = true)
    public java.util.List<Integer> getGameIds(UUID collectionId) {
        return entryRepository.findByCollectionId(collectionId).stream()
                .map(entry -> entry.getUserGame().getIgdbId())
                .toList();
    }

    @Transactional
    public void remove(String userId, UUID collectionId, Integer igdbId) {
        UserGame userGame = userGameService.findByUserIdAndIgdbId(userId, igdbId)
                .orElseThrow();

        entryRepository.deleteByCollectionIdAndUserGameId(collectionId, userGame.getId());
    }
}