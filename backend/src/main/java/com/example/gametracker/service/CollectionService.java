package com.example.gametracker.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.gametracker.dto.CollectionRequest;
import com.example.gametracker.model.GameCollection;
import com.example.gametracker.repository.CollectionEntryRepository;
import com.example.gametracker.repository.CollectionRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CollectionService {

    private final CollectionRepository repository;
    private final CollectionEntryRepository entryRepository;

    public GameCollection create(String userId, String name) {
        return repository.save(
                GameCollection.builder()
                        .userId(userId)
                        .name(name)
                        .build());
    }

    public List<GameCollection> getUserCollections(String userId) {
        return repository.findByUserId(userId);
    }

    public GameCollection get(UUID id) {
        return repository.findById(id).orElseThrow();
    }

    @Transactional
    public void delete(String userId, UUID id) {
        GameCollection col = repository.findByIdAndUserId(id, userId)
                .orElseThrow();

        entryRepository.deleteByCollectionId(id);
        repository.delete(col);
    }

    @Transactional
    public GameCollection update(String userId, UUID id, CollectionRequest req) {
        GameCollection col = repository.findByIdAndUserId(id, userId)
                .orElseThrow();

        if (req.getName() != null) {
            col.setName(req.getName());
        }
        if (req.getDescription() != null) {
            col.setDescription(req.getDescription());
        }
        if (req.getIsLocked() != null) {
            col.setLocked(req.getIsLocked());
        }

        return repository.save(col);
    }
}