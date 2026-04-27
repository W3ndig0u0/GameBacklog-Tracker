package com.example.gametracker.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.gametracker.dto.UserProfileDto;
import com.example.gametracker.model.GameCollection;
import com.example.gametracker.model.GameViewHistory;
import com.example.gametracker.model.Review;
import com.example.gametracker.model.UserProfile;
import com.example.gametracker.repository.CollectionRepository;
import com.example.gametracker.repository.ReviewRepository;
import com.example.gametracker.repository.UserGameRepository;
import com.example.gametracker.repository.UserProfileRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserProfileRepository repository;
    private final ReviewRepository reviewRepository;
    private final CollectionRepository collectionRepository;
    private final UserGameRepository userGameRepository;
    private final GameViewHistoryRepository gameViewHistoryRepository;

    @Transactional
    public UserProfileDto syncFromJwt(Jwt jwt) {
        System.out.println("ALLA JWT CLAIMS: " + jwt.getClaims());
        String auth0Sub = jwt.getSubject();

        UserProfile user = repository.findByAuth0Sub(auth0Sub)
                .orElseGet(() -> createFromJwt(jwt));

        updateFromJwt(user, jwt);

        return toDto(user);
    }

    public UserProfileDto getProfile(String auth0Sub) {
        UserProfile profile = repository.findByAuth0Sub(auth0Sub)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User profile not found"));
        return toDto(profile);
    }

    public List<GameCollection> getPublicCollections(String auth0Sub) {
        return collectionRepository.findByUserIdAndIsLockedFalse(auth0Sub);
    }

    public List<Review> getReviews(String auth0Sub) {
        return reviewRepository.findByUserId(auth0Sub);
    }

    public List<GameViewHistory> getRecentViews(String auth0Sub) {
        return gameViewHistoryRepository.findTop10ByUserIdOrderByClickedAtDesc(auth0Sub);
    }

    @Transactional
    public GameViewHistory recordView(String auth0Sub, Integer igdbId, String gameName, String coverUrl) {
        LocalDateTime now = LocalDateTime.now();

        return gameViewHistoryRepository.findByUserIdAndIgdbId(auth0Sub, igdbId)
                .map(existing -> {
                    existing.setGameName(gameName);
                    existing.setCoverUrl(coverUrl);
                    existing.setClickedAt(now);
                    return gameViewHistoryRepository.save(existing);
                })
                .orElseGet(() -> gameViewHistoryRepository.save(
                        GameViewHistory.builder()
                                .userId(auth0Sub)
                                .igdbId(igdbId)
                                .gameName(gameName)
                                .coverUrl(coverUrl)
                                .clickedAt(now)
                                .build()));
    }

    private void updateFromJwt(UserProfile user, Jwt jwt) {
        String name = jwt.getClaimAsString("https://gamebacklog-tracker.pages.dev/name");
        String picture = jwt.getClaimAsString("https://gamebacklog-tracker.pages.dev/picture");
        String email = jwt.getClaimAsString("https://gamebacklog-tracker.pages.dev/email");

        // Fallback if somehow still null
        if (name == null || name.isBlank())
            name = "User";

        if (!name.equals(user.getAuth0Sub())) {
            user.setDisplayName(name);
        }

        if (picture != null && !picture.isBlank()) {
            user.setPictureUrl(picture);
        }

        if (email != null && !email.isBlank()) {
            user.setEmail(email);
        }

        repository.save(user);
    }

    private UserProfile createFromJwt(Jwt jwt) {
        String name = jwt.getClaimAsString("https://gamebacklog-tracker.pages.dev/name");
        String picture = jwt.getClaimAsString("https://gamebacklog-tracker.pages.dev/picture");
        String email = jwt.getClaimAsString("https://gamebacklog-tracker.pages.dev/email");

        if (name == null || name.isBlank())
            name = "User";

        UserProfile user = UserProfile.builder()
                .auth0Sub(jwt.getSubject())
                .displayName(name)
                .pictureUrl(picture)
                .email(email)
                .build();

        return repository.save(user);
    }

    public UserProfileDto toDto(UserProfile profile) {
        String auth0Sub = profile.getAuth0Sub();

        return UserProfileDto.builder()
                .id(profile.getId())
                .auth0Sub(auth0Sub)
                .displayName(
                        profile.getDisplayName() != null
                                && !profile.getDisplayName().equals(auth0Sub)
                                        ? profile.getDisplayName()
                                        : "User")
                .pictureUrl(profile.getPictureUrl())
                .email(profile.getEmail())
                .createdAt(profile.getCreatedAt())
                .reviewCount(reviewRepository.countByUserId(auth0Sub))
                .collectionCount(collectionRepository.countByUserId(auth0Sub))
                .libraryCount(userGameRepository.countByUserIdAndArchivedFalse(auth0Sub))
                .favoriteCount(userGameRepository.countByUserIdAndIsFavoriteTrue(auth0Sub))
                .build();
    }
}

interface GameViewHistoryRepository extends JpaRepository<GameViewHistory, UUID> {

    List<GameViewHistory> findTop10ByUserIdOrderByClickedAtDesc(String userId);

    Optional<GameViewHistory> findByUserIdAndIgdbId(String userId, Integer igdbId);
}