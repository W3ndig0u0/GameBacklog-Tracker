package com.example.gametracker.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.gametracker.model.GameCollection;

public interface CollectionRepository extends JpaRepository<GameCollection, UUID> {
    List<GameCollection> findByUserId(String userId);

    List<GameCollection> findByUserIdAndIsLockedFalse(String userId);

    long countByUserId(String userId);

    Optional<GameCollection> findByIdAndUserId(UUID id, String userId);
}