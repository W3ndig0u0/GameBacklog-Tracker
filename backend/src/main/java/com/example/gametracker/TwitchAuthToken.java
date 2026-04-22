package com.example.gametracker;

import com.example.gametracker.dto.TwitchTokenResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class TwitchAuthToken {
    private String accessToken;
    private long expiresAt;

    @Value("${igdb.client-id}")
    private String clientId;

    @Value("${igdb.client-secret}")
    private String clientSecret;

    public String getToken() {
        if (accessToken == null || System.currentTimeMillis() > expiresAt) {
            refreshToken();
        }
        return accessToken;
    }

    private void refreshToken() {
        WebClient webClient = WebClient.create("https://id.twitch.tv");

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

        accessToken = res.getAccess_token();
        expiresAt = System.currentTimeMillis() + (res.getExpires_in() * 1000L);
    }
}
