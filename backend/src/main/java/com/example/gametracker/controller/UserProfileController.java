package com.example.gametracker.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.gametracker.dto.GameViewRequest;
import com.example.gametracker.dto.UserProfileDto;
import com.example.gametracker.model.GameCollection;
import com.example.gametracker.model.GameViewHistory;
import com.example.gametracker.model.Review;
import com.example.gametracker.model.UserGame;
import com.example.gametracker.service.UserProfileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserProfileService service;

    @GetMapping("/me")
    public UserProfileDto me(@AuthenticationPrincipal Jwt jwt) {
        return service.syncFromJwt(jwt);
    }

    @GetMapping("/{auth0Sub}")
    public UserProfileDto profile(@PathVariable String auth0Sub) {
        return service.getProfile(auth0Sub);
    }

    @GetMapping("/{auth0Sub}/collections")
    public List<GameCollection> collections(@PathVariable String auth0Sub) {
        return service.getPublicCollections(auth0Sub);
    }

    @GetMapping("/{auth0Sub}/reviews")
    public List<Review> reviews(@PathVariable String auth0Sub) {
        return service.getReviews(auth0Sub);
    }

    @GetMapping("/{auth0Sub}/library")
    public List<UserGame> library(@PathVariable String auth0Sub) {
        return service.getLibrary(auth0Sub);
    }

    @GetMapping("/{auth0Sub}/history")
    public List<GameViewHistory> publicHistory(@PathVariable String auth0Sub) {
        return service.getRecentViews(auth0Sub);
    }

    @GetMapping("/me/history")
    public List<GameViewHistory> history(@AuthenticationPrincipal Jwt jwt) {
        return service.getRecentViews(jwt.getSubject());
    }

    @PostMapping("/me/history")
    public GameViewHistory recordHistory(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody GameViewRequest req) {

        return service.recordView(
                jwt.getSubject(),
                req.getIgdbId(),
                req.getGameName(),
                req.getCoverUrl());
    }
}
