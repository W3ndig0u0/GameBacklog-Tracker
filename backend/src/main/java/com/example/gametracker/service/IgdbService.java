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
        String body = """
            search "%s";
            fields id,name,cover.url,first_release_date;
            limit 10;
            """.formatted(query);

        return callIgdb(body);
    }
    public String getTrendingGames() {

        String body = """
        fields id,name,cover.url,total_rating,first_release_date;
        sort total_rating desc;
        where total_rating != null;
        limit 20;
        """;

        return callIgdb(body);
    }

    public String getPopularGames() {

        String body = """
        fields id,name,cover.url,total_rating_count;
        sort total_rating_count desc;
        limit 20;
    """;

        return callIgdb(body);
    }

    public String getTopRatedGames() {

        String body = """
        fields id,name,cover.url,total_rating;
        sort total_rating desc;
        limit 20;
    """;

        return callIgdb(body);
    }

    private String callIgdb(String body) {
        return webClient.post()
                .uri("https://api.igdb.com/v4/games")
                .header("Client-ID", clientId)
                .header("Authorization", "Bearer " + twitchAuthToken.getToken())
                .contentType(MediaType.TEXT_PLAIN)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}