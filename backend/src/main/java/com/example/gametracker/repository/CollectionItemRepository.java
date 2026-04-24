package com.example.gametracker.repository;

import com.example.gametracker.model.CollectionItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CollectionItemRepository extends JpaRepository<CollectionItem, UUID> {
    List<CollectionItem> findByUserId(String userId);
    Optional<CollectionItem> findByUserIdAndIgdbId(String userId, Integer igdbId);
    void deleteByUserIdAndIgdbId(String userId, Integer igdbId);
}