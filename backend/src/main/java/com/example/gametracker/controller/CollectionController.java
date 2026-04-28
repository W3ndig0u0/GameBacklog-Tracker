package com.example.gametracker.controller;

import java.util.List;
import java.util.UUID;

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

import com.example.gametracker.dto.CollectionRequest;
import com.example.gametracker.model.CollectionEntry;
import com.example.gametracker.model.GameCollection;
import com.example.gametracker.service.CollectionEntryService;
import com.example.gametracker.service.CollectionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/collections")
@RequiredArgsConstructor
public class CollectionController {

    private final CollectionService service;
    private final CollectionEntryService entryService;

    @GetMapping
    public List<GameCollection> all(@AuthenticationPrincipal Jwt jwt) {
        return service.getUserCollections(jwt.getSubject());
    }

    @PostMapping
    public GameCollection create(@AuthenticationPrincipal Jwt jwt,
            @RequestBody CollectionRequest req) {
        return service.create(jwt.getSubject(), req.getName());
    }

    @PostMapping("/{id}/games")
    public CollectionEntry addGame(@AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id,
            @RequestBody com.example.gametracker.dto.AddGameRequest req) {
        return entryService.add(jwt.getSubject(), id, req.getIgdbId());
    }

    @GetMapping("/{id}/games")
    public java.util.List<Integer> games(@PathVariable UUID id) {
        return entryService.getGameIds(id);
    }

    @DeleteMapping("/{id}/games/{gameId}")
    public void removeGame(@AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id,
            @PathVariable Integer gameId) {
        entryService.remove(jwt.getSubject(), id, gameId);
    }

    @DeleteMapping("/{id}")
    public void delete(@AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id) {
        service.delete(jwt.getSubject(), id);
    }

    @PatchMapping("/{id}")
    public GameCollection update(@AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id,
            @RequestBody CollectionRequest req) {
        return service.update(jwt.getSubject(), id, req);
    }
}