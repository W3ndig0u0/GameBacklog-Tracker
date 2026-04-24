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

    public CollectionItem addToCollection(String userId, Integer igdbId) {
        return repository.findByUserIdAndIgdbId(userId, igdbId)
                .orElseGet(() -> repository.save(CollectionItem.builder()
                        .userId(userId)
                        .igdbId(igdbId)
                        .status(GameStatus.BACKLOG)
                        .build()));
    }

    @Transactional
    public void updateItem(String userId, Integer igdbId, CollectionRequest updates) {
        repository.findByUserIdAndIgdbId(userId, igdbId).ifPresent(item -> {
            if (updates.getStatus() != null) item.setStatus(GameStatus.valueOf(updates.getStatus()));
            repository.save(item);
        });
    }

    @Transactional
    public void removeFromCollection(String userId, Integer igdbId) {
        repository.deleteByUserIdAndIgdbId(userId, igdbId);
    }
}