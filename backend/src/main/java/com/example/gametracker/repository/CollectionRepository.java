package com.example.gametracker.repository;

import com.example.gametracker.model.GameCollection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CollectionRepository extends JpaRepository<GameCollection, UUID> {
    List<GameCollection> findByUserId(String userId);
    Optional<GameCollection> findByIdAndUserId(UUID id, String userId);}