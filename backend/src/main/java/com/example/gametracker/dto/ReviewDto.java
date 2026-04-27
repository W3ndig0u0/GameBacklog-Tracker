package com.example.gametracker.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ReviewDto {
    private Integer igdbId;
    private String userId;

    private String reviewText;
    private int starRating;
    private LocalDateTime reviewedAt;
}
