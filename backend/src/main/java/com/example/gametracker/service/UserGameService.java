package com.example.gametracker.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.gametracker.dto.UserGameRequest;
import com.example.gametracker.model.GameStatus;
import com.example.gametracker.model.UserGame;
import com.example.gametracker.repository.UserGameRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserGameService {

    private final UserGameRepository repository;

    public List<UserGame> getCollection(String userId) {
        return repository.findByUserIdAndArchivedFalse(userId);
    }

    public List<UserGame> getByStatus(String userId, GameStatus status) {
        return repository.findByUserIdAndStatusAndArchivedFalse(userId, status);
    }

    public UserGame getOrCreate(String userId, Integer igdbId) {
        return repository.findByUserIdAndIgdbId(userId, igdbId)
                .map(existing -> {
                    if (existing.isArchived()) {
                        existing.setArchived(false);
                    }
                    return repository.save(existing);
                })
                .orElseGet(() -> repository.save(
                        UserGame.builder()
                                .userId(userId)
                                .igdbId(igdbId)
                                .status(GameStatus.BACKLOG)
                                .isFavorite(false)
                                .archived(false)
                                .build()));
    }

    @Transactional
    public UserGame update(String userId, Integer igdbId, UserGameRequest updates) {
        UserGame item = getOrCreate(userId, igdbId);

        if (updates.getStatus() != null) {
            try {
                item.setStatus(GameStatus.valueOf(updates.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid status: " + updates.getStatus());
            }
        }

        if (updates.getIsFavorite() != null) {
            item.setIsFavorite(updates.getIsFavorite());
        }

        return repository.save(item);
    }

    @Transactional
    public void remove(String userId, Integer igdbId) {
        repository.findByUserIdAndIgdbId(userId, igdbId)
                .ifPresent(item -> {
                    item.setArchived(true);
                    repository.save(item);
                });
    }

    public Optional<UserGame> findByUserIdAndIgdbId(String userId, Integer igdbId) {
        return repository.findByUserIdAndIgdbId(userId, igdbId);
    }
}