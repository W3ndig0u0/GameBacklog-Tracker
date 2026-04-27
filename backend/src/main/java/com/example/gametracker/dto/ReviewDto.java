package com.example.gametracker.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewDto {
    private String reviewText;
    private LocalDateTime reviewedAt;
    private int starRating;
}
