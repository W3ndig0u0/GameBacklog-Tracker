package com.example.gametracker.repository;

import com.example.gametracker.model.UserGame;
import com.example.gametracker.model.GameStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserGameRepository extends JpaRepository<UserGame, UUID> {
    List<UserGame> findByUserId(String userId);
    Optional<UserGame> findByUserIdAndIgdbId(String userId, Integer igdbId);
    void deleteByUserIdAndIgdbId(String userId, Integer igdbId);
    List<UserGame> findByUserIdAndStatus(String userId, GameStatus status);
}