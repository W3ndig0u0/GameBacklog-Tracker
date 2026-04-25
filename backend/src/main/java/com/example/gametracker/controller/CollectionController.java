package com.example.gametracker.controller;

import com.example.gametracker.dto.CollectionRequest;
import com.example.gametracker.dto.UserGameRequest;
import com.example.gametracker.model.CollectionEntry;
import com.example.gametracker.model.GameStatus;
import com.example.gametracker.model.UserGame;
import com.example.gametracker.service.CollectionEntryService;
import com.example.gametracker.service.CollectionService;
import com.example.gametracker.service.UserGameService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import com.example.gametracker.model.Collection;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/collections")
@RequiredArgsConstructor
public class CollectionController {

    private final CollectionService service;
    private final CollectionEntryService entryService;

    @GetMapping
    public List<Collection> all(@AuthenticationPrincipal Jwt jwt) {
        return service.getUserCollections(jwt.getSubject());
    }

    @PostMapping
    public Collection create(@AuthenticationPrincipal Jwt jwt,
                             @RequestBody String name) {
        return service.create(jwt.getSubject(), name);
    }

    @PostMapping("/{id}/games")
    public CollectionEntry addGame(@AuthenticationPrincipal Jwt jwt,
                                   @PathVariable UUID id,
                                   @RequestBody Integer igdbId) {
        return entryService.add(jwt.getSubject(), id, igdbId);
    }

    @DeleteMapping("/{id}/games/{gameId}")
    public void removeGame(@PathVariable UUID id,
                           @PathVariable UUID gameId) {
        entryService.remove(id, gameId);
    }

    @DeleteMapping("/{id}")
    public void delete(@AuthenticationPrincipal Jwt jwt,
                       @PathVariable UUID id) {
        service.delete(jwt.getSubject(), id);
    }

    @PatchMapping("/{id}")
    public Collection update(@AuthenticationPrincipal Jwt jwt,
                             @PathVariable UUID id,
                             @RequestBody CollectionRequest req) {
        return service.update(jwt.getSubject(), id, req);
    }
}