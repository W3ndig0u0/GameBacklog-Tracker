package com.example.gametracker.service;

import com.example.gametracker.dto.CollectionRequest;
import com.example.gametracker.model.CollectionItem;
import com.example.gametracker.model.GameStatus;
import com.example.gametracker.repository.CollectionItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CollectionService {

    private final CollectionItemRepository repository;

    public List<CollectionItem> getCollection(String userId) {
        return repository.findByUserId(userId);
    }

    public List<CollectionItem> getByStatus(String userId, GameStatus status) {
        return repository.findByUserIdAndStatus(userId, status);
    }

    public CollectionItem addToCollection(String userId, Integer igdbId) {
        return repository.findByUserIdAndIgdbId(userId, igdbId)
                .orElseGet(() -> repository.save(CollectionItem.builder()
                        .userId(userId)
                        .igdbId(igdbId)
                        .status(GameStatus.BACKLOG)
                        .isFavorite(false)
                        .build()));
    }

    @Transactional
    public CollectionItem updateItem(String userId, Integer igdbId, CollectionRequest updates) {
        CollectionItem item = repository.findByUserIdAndIgdbId(userId, igdbId)
                .orElseThrow(() -> new RuntimeException("Game not found in library"));

        if (updates.getStatus() != null) {
            item.setStatus(GameStatus.valueOf(updates.getStatus().toUpperCase()));
        }
        if (updates.getUserRating() != null) {
            item.setUserRating(updates.getUserRating());
        }
        if (updates.getReviewNotes() != null) {
            item.setReviewNotes(updates.getReviewNotes());
        }
        if (updates.getIsFavorite() != null) {
            item.setIsFavorite(updates.getIsFavorite());
        }

        return repository.save(item);
    }

    @Transactional
    public void removeFromCollection(String userId, Integer igdbId) {
        repository.deleteByUserIdAndIgdbId(userId, igdbId);
    }
}