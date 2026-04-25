package com.example.gametracker.controller;

import com.example.gametracker.dto.UserGameRequest;
import com.example.gametracker.model.UserGame;
import com.example.gametracker.model.GameStatus;
import com.example.gametracker.service.UserGameService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/library")
@RequiredArgsConstructor
public class UserGameController {

    private final UserGameService service;

    @GetMapping
    public List<UserGame> all(@AuthenticationPrincipal Jwt jwt) {
        return service.getCollection(jwt.getSubject());
    }

    @GetMapping("/status/{status}")
    public List<UserGame> byStatus(@AuthenticationPrincipal Jwt jwt,
                                   @PathVariable String status) {
        return service.getByStatus(jwt.getSubject(),
                GameStatus.valueOf(status.toUpperCase()));
    }

    @PatchMapping("/{igdbId}")
    public UserGame update(@AuthenticationPrincipal Jwt jwt,
                           @PathVariable Integer igdbId,
                           @RequestBody UserGameRequest req) {
        return service.update(jwt.getSubject(), igdbId, req);
    }

    @DeleteMapping("/{igdbId}")
    public void delete(@AuthenticationPrincipal Jwt jwt,
                       @PathVariable Integer igdbId) {
        service.remove(jwt.getSubject(), igdbId);
    }
}