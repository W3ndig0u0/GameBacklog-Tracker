package com.example.gametracker.service;

import com.example.gametracker.dto.CollectionRequest;
import com.example.gametracker.model.Collection;
import com.example.gametracker.repository.CollectionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CollectionService {

    private final CollectionRepository repository;

    public Collection create(String userId, String name) {
        return repository.save(
                Collection.builder()
                        .userId(userId)
                        .name(name)
                        .build()
        );
    }

    public List<Collection> getUserCollections(String userId) {
        return repository.findByUserId(userId);
    }

    public Collection get(UUID id) {
        return repository.findById(id).orElseThrow();
    }

    @Transactional
    public void delete(String userId, UUID id) {
        Collection col = repository.findByIdAndUserId(id, userId)
                .orElseThrow();

        repository.delete(col);
    }

    @Transactional
    public Collection update(String userId, UUID id, CollectionRequest req) {
        Collection col = repository.findByIdAndUserId(id, userId)
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