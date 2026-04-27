package com.example.gametracker.model;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_games", uniqueConstraints = @UniqueConstraint(columnNames = { "user_id", "igdb_id" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserGame {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "igdb_id", nullable = false)
    private Integer igdbId;

    @Enumerated(EnumType.STRING)
    private GameStatus status;

    @Builder.Default
    private Boolean isFavorite = false;

    @Column(nullable = false, columnDefinition = "boolean default false")
    @Builder.Default
    private boolean archived = false;

    @CreationTimestamp
    private LocalDateTime addedAt;
}
