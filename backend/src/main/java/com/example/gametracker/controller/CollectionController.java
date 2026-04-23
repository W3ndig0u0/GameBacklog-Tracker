package com.example.gametracker.controller;

import com.example.gametracker.dto.CollectionRequest;
import com.example.gametracker.model.CollectionItem;
import com.example.gametracker.service.CollectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collection")
@RequiredArgsConstructor
public class CollectionController {

    private final CollectionService collectionService;

    @GetMapping
    public List<CollectionItem> getMyCollection(@AuthenticationPrincipal Jwt jwt) {
        return collectionService.getCollection(jwt.getSubject());
    }

    @PostMapping("/add")
    public CollectionItem add(@AuthenticationPrincipal Jwt jwt, @RequestBody CollectionRequest request) {
        return collectionService.addToCollection(jwt.getSubject(), request.getIgdbId());
    }

    @PatchMapping("/{igdbId}")
    public void update(@AuthenticationPrincipal Jwt jwt,
                       @PathVariable Integer igdbId,
                       @RequestBody CollectionRequest request) {
        collectionService.updateItem(jwt.getSubject(), igdbId, request);
    }

    @DeleteMapping("/{igdbId}")
    public void remove(@AuthenticationPrincipal Jwt jwt, @PathVariable Integer igdbId) {
        collectionService.removeFromCollection(jwt.getSubject(), igdbId);
    }
}