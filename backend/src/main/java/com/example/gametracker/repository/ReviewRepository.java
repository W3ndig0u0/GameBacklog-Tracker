package com.example.gametracker.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.gametracker.model.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByIgdbId(Integer igdbId);

    List<Review> findByUserId(String userId);

    Optional<Review> findByUserIdAndIgdbId(String userId, Integer igdbId);

    void deleteByUserIdAndIgdbId(String userId, Integer igdbId);
}
