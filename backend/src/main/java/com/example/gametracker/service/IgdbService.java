package com.example.gametracker.service;

import com.example.gametracker.TwitchAuthToken;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
@RequiredArgsConstructor
public class IgdbService {

    private final TwitchAuthToken twitchAuthToken;

    @Value("${igdb.client-id}")
    private String clientId;

    private final WebClient webClient = WebClient.create();

    @Cacheable(value = "gameSearch", key = "#query")
    public String search(String query) {

        String token = twitchAuthToken.getToken();

        String body = """
                search "%s";
                fields id,name,cover.url,first_release_date;
                limit 10;
                """.formatted(query);

        return webClient.post()
                .uri("https://api.igdb.com/v4/games")
                .header("Client-ID", clientId)
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.TEXT_PLAIN)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}