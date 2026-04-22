package com.example.gametracker.service;

import com.example.gametracker.TwitchAuthToken;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatusCode;
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
        fields id,name,cover.url,first_release_date,
                total_rating,total_rating_count,summary,genres.name;
        where cover != null;
        limit 10;
    """.formatted(query);
        String result = callIgdb(body);
        System.out.println("IGDB RESULT: " + result);
        return result;
    }
    @Cacheable(value = "topTrendingGames")
    public String getTrendingGames() {

        String body = """
            fields id,name,cover.url,first_release_date,
                    total_rating,total_rating_count,hypes;
            where cover != null;
            sort hypes desc;
            limit 20;
        """;

        return callIgdb(body);
    }

    @Cacheable(value = "popularGames")
    public String getPopularGames() {

        String body = """
            fields id,name,cover.url,first_release_date,
                    total_rating,total_rating_count;
            where cover != null;
            sort total_rating_count desc;
            limit 20;
        """;

        return callIgdb(body);
    }

    @Cacheable(value = "topRatedGames")
    public String getTopRatedGames() {

        String body = """
            fields id,name,cover.url,first_release_date,
                    total_rating,total_rating_count,aggregated_rating;
            where cover != null & total_rating != null;
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
                .header("Accept", "application/json")
                .header("Content-Type", "text/plain")
                .bodyValue(body)
                .retrieve()
                .onStatus(
                        HttpStatusCode::isError,
                        response -> response.bodyToMono(String.class)
                                .map(msg -> new RuntimeException("IGDB ERROR: " + msg))
                )
                .bodyToMono(String.class)
                .block();
    }
}