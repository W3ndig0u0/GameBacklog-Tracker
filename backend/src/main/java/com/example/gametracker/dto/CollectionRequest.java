package com.example.gametracker.dto;

import lombok.Data;

@Data
public class CollectionRequest {
    private String name;
    private String description;
    private Boolean isLocked;
}
