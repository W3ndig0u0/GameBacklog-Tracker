package com.example.gametracker.controller;

import com.example.gametracker.service.IgdbService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class GameController {

    private final IgdbService igdbService;

    @GetMapping("/games")
    public ResponseEntity<String> getGames() {
        return ResponseEntity.ok("Games");
    }

    @GetMapping
    public ResponseEntity<String> welcome() {
        return ResponseEntity.ok("WELCOME TO GAME TRACKER BACKEND");
    }

    @GetMapping("/games/trending")
    public ResponseEntity<String> trending() {
        return ResponseEntity.ok(igdbService.getTrendingGames());
    }

    @GetMapping("/games/popular")
    public ResponseEntity<String> popular() {
        return ResponseEntity.ok(igdbService.getPopularGames());
    }

    @GetMapping("/games/top-rated")
    public ResponseEntity<String> topRated() {
        return ResponseEntity.ok(igdbService.getTopRatedGames());
    }

    @GetMapping("/games/search")
    public ResponseEntity<String> search(@RequestParam String q) {
        return ResponseEntity.ok(igdbService.search(q));
    }

    @GetMapping("/games/{id}")
    public ResponseEntity<String> getGame(@PathVariable long id) {
        return ResponseEntity.ok(igdbService.getGame(id));
    }
}