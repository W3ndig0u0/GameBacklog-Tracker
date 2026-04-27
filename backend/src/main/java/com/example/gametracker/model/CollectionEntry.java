package com.example.gametracker.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "collection_entries",
        uniqueConstraints = @UniqueConstraint(columnNames = {"collection_id", "user_game_id"}),
        indexes = {
                @Index(columnList = "collection_id"),
                @Index(columnList = "user_game_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CollectionEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "collection_id")
    private GameCollection collection;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_game_id")
    private UserGame userGame;

    @CreationTimestamp
    private LocalDateTime addedAt;
}