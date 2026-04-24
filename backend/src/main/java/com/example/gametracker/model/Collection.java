package com.example.gametracker.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "collections")
@Data
public class Collection {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String description;
    private String userId;

    @OneToMany(mappedBy = "collection", cascade = CascadeType.ALL)
    private List<CollectionItem> items;

    @Enumerated(EnumType.STRING)
    private CollectionType type = CollectionType.CUSTOM;
    private Boolean isLocked = false;
}
