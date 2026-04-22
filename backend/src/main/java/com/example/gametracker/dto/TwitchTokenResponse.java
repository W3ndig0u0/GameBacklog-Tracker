package com.example.gametracker.dto;

import lombok.Data;

@Data
public class TwitchTokenResponse {
    private String access_token;
    private int expires_in;
}