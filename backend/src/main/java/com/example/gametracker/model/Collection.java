package com.example.gametracker.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "collections")
@Getter
@Setter
public class Collection {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String description;
    private String userId;

    @ManyToMany
    @JoinTable(
            name = "collection_game_mapping",
            joinColumns = @JoinColumn(name = "collection_id"),
            inverseJoinColumns = @JoinColumn(name = "user_game_id")
    )
    private Set<CollectionItem> items;

    @Enumerated(EnumType.STRING)
    private CollectionType type = CollectionType.CUSTOM;
    private Boolean isLocked = false;
}
