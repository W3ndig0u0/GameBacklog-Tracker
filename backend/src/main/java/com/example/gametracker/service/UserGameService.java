package com.example.gametracker.service;

import com.example.gametracker.dto.UserGameRequest;
import com.example.gametracker.model.Review;
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

        if (updates.getReviewNotes() != null) {
            Review review = item.getReview();

            if (review == null) {
                review = new Review();
                item.setReview(review);
            }

            review.setReviewText(updates.getReviewNotes());
        }
        return repository.save(item);
    }

    @Transactional
    public void remove(String userId, Integer igdbId) {
        repository.deleteByUserIdAndIgdbId(userId, igdbId);
    }
}