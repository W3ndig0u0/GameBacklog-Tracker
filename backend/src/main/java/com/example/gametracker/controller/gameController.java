package com.example.gametracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = {"https://gamebacklog-tracker.pages.dev", "http://localhost:5173"})@RestController
@RequestMapping()
public class gameController {
    @GetMapping("/api/games")

    public ResponseEntity<String> getGames() {
        return ResponseEntity.ok("Games");
    }

    @GetMapping
    public ResponseEntity<String> welcome() {
        return ResponseEntity.ok("WELCOME TO GAME TRACKER BACKEND");
    }


}
