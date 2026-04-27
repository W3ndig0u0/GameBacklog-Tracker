package com.example.gametracker.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.gametracker.model.GameStatus;
import com.example.gametracker.model.UserGame;

public interface UserGameRepository extends JpaRepository<UserGame, UUID> {
    List<UserGame> findByUserIdAndArchivedFalse(String userId);

    long countByUserIdAndArchivedFalse(String userId);

    long countByUserIdAndIsFavoriteTrue(String userId);

    Optional<UserGame> findByUserIdAndIgdbId(String userId, Integer igdbId);

    List<UserGame> findByUserIdAndStatusAndArchivedFalse(String userId, GameStatus status);
}