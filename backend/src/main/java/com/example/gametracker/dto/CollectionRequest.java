package com.example.gametracker.dto;

import lombok.Data;

@Data
public class CollectionRequest {
    private Integer igdbId;
    private String status;
    private Integer userRating;
    private String reviewNotes;
}