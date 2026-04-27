package com.example.gametracker.service;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.gametracker.TwitchAuthToken;

import lombok.RequiredArgsConstructor;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class IgdbService {

    private final TwitchAuthToken twitchAuthToken;

    @Value("${igdb.client-id}")
    private String clientId;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://api.igdb.com/v4")
            .build();

    @Cacheable(value = "gameSearch", key = "#query")
    public String search(String query) {

        String body = """
                    search "%s";
                    fields id,name,cover.url,first_release_date,
                           genres.name,themes.name,platforms.name,
                           total_rating,total_rating_count;
                    where cover != null;
                    limit 20;
                """.formatted(query);

        return callIgdb(body);
    }

    @Cacheable(value = "topTrendingGames")
    public String getTrendingGames() {

        String body = """
                    fields id,name,cover.url,first_release_date,
                           genres.name,themes.name,platforms.name,
                           total_rating,total_rating_count,hypes;
                    where cover != null & hypes != null;
                    sort hypes desc;
                    limit 12;
                """;

        return callIgdb(body);
    }

    @Cacheable(value = "popularGames")
    public String getPopularGames() {

        String body = """
                    fields id,name,cover.url,first_release_date,
                           genres.name,themes.name,platforms.name,
                           total_rating,total_rating_count;
                    where cover != null & total_rating_count != null;
                    sort total_rating_count desc;
                    limit 12;
                """;

        return callIgdb(body);
    }

    @Cacheable(value = "topRatedGames")
    public String getTopRatedGames() {

        String body = """
                    fields id,name,cover.url,first_release_date,
                           genres.name,themes.name,platforms.name,
                           total_rating,total_rating_count;
                    where cover != null & total_rating != null;
                    sort total_rating desc;
                    limit 12;
                """;

        return callIgdb(body);
    }

    public String getGame(long id) {

        String body = String.format("""
                fields id, name, summary, storyline, first_release_date,
                       genres.name, themes.name, platforms.name, game_modes.name,
                       total_rating, total_rating_count, cover.url,
                       screenshots.image_id, artworks.image_id, videos.video_id,
                       involved_companies.company.name, involved_companies.developer,
                       similar_games.name, similar_games.cover.image_id;
                where id = %d;
                """, id);

        return callIgdb(body);
    }

    private String callIgdb(String body) {
        return webClient.post()
                .uri("/games")
                .header("Client-ID", clientId)
                .header("Authorization", "Bearer " + twitchAuthToken.getToken())
                .contentType(MediaType.TEXT_PLAIN)
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(5))
                .onErrorResume(e -> Mono.error(
                        new RuntimeException("IGDB CALL FAILED: " + e.getMessage())))
                .block();
    }
}