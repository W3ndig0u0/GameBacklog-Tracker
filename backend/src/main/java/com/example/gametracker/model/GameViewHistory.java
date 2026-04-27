package com.example.gametracker.model;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "game_view_history", uniqueConstraints = @UniqueConstraint(columnNames = { "user_id",
        "igdb_id" }), indexes = {
                @Index(name = "idx_game_view_history_user_id", columnList = "user_id"),
                @Index(name = "idx_game_view_history_clicked_at", columnList = "clicked_at")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameViewHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "igdb_id", nullable = false)
    private Integer igdbId;

    @Column(name = "game_name", nullable = false)
    private String gameName;

    @Column(name = "cover_url")
    private String coverUrl;

    @Column(name = "clicked_at", nullable = false)
    private LocalDateTime clickedAt;
}