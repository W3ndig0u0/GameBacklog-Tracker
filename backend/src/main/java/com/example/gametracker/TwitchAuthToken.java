package com.example.gametracker;

import com.example.gametracker.dto.TwitchTokenResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class TwitchAuthToken {

    private volatile String accessToken;
    private volatile long expiresAt;

    @Value("${igdb.client-id}")
    private String clientId;

    @Value("${igdb.client-secret}")
    private String clientSecret;

    public synchronized String getToken() {
        if (accessToken == null || System.currentTimeMillis() > expiresAt) {
            refreshToken();
        }
        return accessToken;
    }

    private void refreshToken() {
        WebClient webClient = WebClient.create("https://id.twitch.tv");

        try {
            TwitchTokenResponse res = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/oauth2/token")
                            .queryParam("client_id", clientId)
                            .queryParam("client_secret", clientSecret)
                            .queryParam("grant_type", "client_credentials")
                            .build())
                    .retrieve()
                    .bodyToMono(TwitchTokenResponse.class)
                    .block();

            if (res == null || res.getAccess_token() == null) {
                throw new RuntimeException("Failed to fetch Twitch token");
            }

            accessToken = res.getAccess_token();
            expiresAt = System.currentTimeMillis() + (res.getExpires_in() * 1000L);

        } catch (Exception e) {
            throw new RuntimeException("Twitch auth failed", e);
        }
    }
}