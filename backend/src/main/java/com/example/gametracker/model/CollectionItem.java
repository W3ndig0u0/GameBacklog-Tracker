package com.example.gametracker.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_games")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CollectionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "igdb_id", nullable = false)
    private Integer igdbId;

    @Enumerated(EnumType.STRING)
    private GameStatus status;

    private Integer userRating;

    @Column(columnDefinition = "TEXT")
    private String reviewNotes;

    private LocalDateTime addedAt = LocalDateTime.now();
}

