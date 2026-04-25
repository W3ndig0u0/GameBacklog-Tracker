package com.example.gametracker.service;

import com.example.gametracker.dto.UserGameRequest;
import com.example.gametracker.model.UserGame;
import com.example.gametracker.model.GameStatus;
import com.example.gametracker.repository.UserGameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserGameService {

    private final UserGameRepository repository;

    public List<UserGame> getCollection(String userId) {
        return repository.findByUserId(userId);
    }

    public List<UserGame> getByStatus(String userId, GameStatus status) {
        return repository.findByUserIdAndStatus(userId, status);
    }

    public UserGame getOrCreate(String userId, Integer igdbId) {
        return repository.findByUserIdAndIgdbId(userId, igdbId)
                .orElseGet(() -> repository.save(
                        UserGame.builder()
                                .userId(userId)
                                .igdbId(igdbId)
                                .status(GameStatus.BACKLOG)
                                .isFavorite(false)
                                .build()
                ));
    }

    @Transactional
    public UserGame update(String userId, Integer igdbId, UserGameRequest updates) {
        UserGame item = repository.findByUserIdAndIgdbId(userId, igdbId)
                .orElseGet(() -> repository.save(
                        UserGame.builder()
                                .userId(userId)
                                .igdbId(igdbId)
                                .status(GameStatus.BACKLOG)
                                .isFavorite(false)
                                .build()
                ));

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
    public void remove(String userId, Integer igdbId) {
        repository.deleteByUserIdAndIgdbId(userId, igdbId);
    }
}