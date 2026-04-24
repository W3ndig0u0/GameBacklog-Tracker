package com.example.gametracker.repository;

import com.example.gametracker.model.Collection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CollectionRepository extends JpaRepository<Collection, UUID> {
    List<Collection> findByUserId(String userId);
}