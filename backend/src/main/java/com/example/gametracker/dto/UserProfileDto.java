package com.example.gametracker.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileDto {
    private UUID id;
    private String auth0Sub;
    private String displayName;
    private String pictureUrl;
    private String email;
    private LocalDateTime createdAt;
    private long reviewCount;
    private long collectionCount;
    private long libraryCount;
    private long favoriteCount;
}