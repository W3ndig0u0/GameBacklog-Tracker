package com.example.gametracker.controller;

import com.example.gametracker.service.IgdbService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"https://gamebacklog-tracker.pages.dev", "http://localhost:5173"})@RestController
@RequestMapping()
public class gameController {
    private final IgdbService igdbService;
    public gameController(IgdbService igdbService) {
        this.igdbService = igdbService;
    }

    @GetMapping("/api/games")
    public ResponseEntity<String> getGames() {
        return ResponseEntity.ok("Games");
    }

    @GetMapping
    public ResponseEntity<String> welcome() {
        return ResponseEntity.ok("WELCOME TO GAME TRACKER BACKEND");
    }


    @GetMapping("/api/games/search")
    public String search(@RequestParam String q) {
        return igdbService.search(q);
    }
}
