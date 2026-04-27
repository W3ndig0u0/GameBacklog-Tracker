package com.example.gametracker.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.gametracker.dto.ReviewDto;
import com.example.gametracker.model.Review;
import com.example.gametracker.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService service;

    @GetMapping("/me")
    public List<Review> myReviews(@AuthenticationPrincipal Jwt jwt) {
        return service.getReviewsByUser(jwt.getSubject());
    }

    @GetMapping("/game/{igdbId}")
    public List<Review> getByGame(@PathVariable Integer igdbId) {
        return service.getReviewsForGame(igdbId);
    }

    @PostMapping
    public Review createOrUpdate(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody ReviewDto req) {
        return service.createOrUpdate(
                jwt.getSubject(),
                req.getIgdbId(),
                req.getReviewText(),
                req.getStarRating());
    }

    @PatchMapping("/{igdbId}")
    public Review update(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Integer igdbId,
            @RequestBody ReviewDto req) {
        return service.partialUpdate(
                jwt.getSubject(),
                igdbId,
                req.getReviewText(),
                req.getStarRating());
    }

    @DeleteMapping("/{igdbId}")
    public void delete(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Integer igdbId) {
        service.delete(jwt.getSubject(), igdbId);
    }
}