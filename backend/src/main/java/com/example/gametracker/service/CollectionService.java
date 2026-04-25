package com.example.gametracker.service;

import com.example.gametracker.model.Collection;
import com.example.gametracker.repository.CollectionRepository;
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
}