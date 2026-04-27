package com.example.gametracker.repository;

import com.example.gametracker.model.CollectionEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CollectionEntryRepository extends JpaRepository<CollectionEntry, UUID> {
    List<CollectionEntry> findByCollectionId(UUID collectionId);
    boolean existsByCollectionIdAndUserGameId(UUID collectionId, UUID userGameId);
    void deleteByCollectionIdAndUserGameId(UUID collectionId, UUID userGameId);
}