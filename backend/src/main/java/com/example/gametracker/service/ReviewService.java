package com.example.gametracker.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.gametracker.model.Review;
import com.example.gametracker.repository.ReviewRepository;

import jakarta.transaction.Transactional;

@Service
public class ReviewService {

    private final ReviewRepository repository;

    public ReviewService(ReviewRepository repository) {
        this.repository = repository;
    }

    public List<Review> getReviewsForGame(Integer igdbId) {
        return repository.findByIgdbId(igdbId);
    }

    public List<Review> getReviewsByUser(String userId) {
        return repository.findByUserId(userId);
    }

    @Transactional
    public Review createOrUpdate(String userId, Integer igdbId, String text, int rating) {

        return repository.findByUserIdAndIgdbId(userId, igdbId)
                .map(existing -> {
                    existing.setReviewText(text);
                    existing.setStarRating(rating);
                    return repository.save(existing);
                })
                .orElseGet(() -> repository.save(
                        Review.builder()
                                .userId(userId)
                                .igdbId(igdbId)
                                .reviewText(text)
                                .starRating(rating)
                                .build()));
    }

    @Transactional
    public void delete(String userId, Integer igdbId) {
        repository.deleteByUserIdAndIgdbId(userId, igdbId);
    }
}
