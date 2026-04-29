import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import type { Review } from "../../api/reviews/review";
import { useDeleteReview } from "../../hooks/review/useReviews";
import { useUserProfiles } from "../../hooks/users/useUsers";
import { SectionTitle } from "./SharedUI";

interface CommunityActivityProps {
  reviews?: Review[];
}

const formatStars = (rating: number) => {
  const clamped = Math.max(1, Math.min(5, rating));
  return `${"★".repeat(clamped)}${"☆".repeat(5 - clamped)}`;
};

const formatName = (userId: string, email?: string) => {
  if (email) return email.split("@")[0];
  if (!userId) return "Unknown User";

  const parts = userId.split("|");

  if (parts[0] === "google-oauth2") return "Google User";
  if (parts[0] === "auth0") return "User";

  return parts.length > 1 ? parts[1] : userId;
};

const formatTimeAgo = (dateString: string) => {
  if (!dateString) return "just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const { label, seconds } of intervals) {
    const value = Math.floor(diffInSeconds / seconds);
    if (value >= 1) {
      return rtf.format(-value, label as Intl.RelativeTimeFormatUnit);
    }
  }

  return "just now";
};

export const CommunityActivity = ({ reviews }: CommunityActivityProps) => {
  const sortedReviews = [...(reviews ?? [])].sort((a, b) => {
    const aTime = new Date(a.updatedAt ?? a.reviewedAt ?? 0).getTime();
    const bTime = new Date(b.updatedAt ?? b.reviewedAt ?? 0).getTime();
    return bTime - aTime;
  });

  const reviewUserIds = Array.from(
    new Set((reviews ?? []).map((review) => review.userId)),
  );
  const { profilesBySub } = useUserProfiles(reviewUserIds);
  const deleteReviewMutation = useDeleteReview();
  const { user } = useAuth0();
  const currentUserId = user?.sub;
  return (
    <section className="mt-10">
      <SectionTitle>Community Activity</SectionTitle>

      <div className="space-y-4">
        {sortedReviews.length > 0 ? (
          sortedReviews.map((review) => {
            const profile = profilesBySub[review.userId];
            const display = profile?.displayName || formatName(review.userId);
            const avatar = profile?.pictureUrl;

            const timeToDisplay = review.updatedAt
              ? review.updatedAt
              : review.reviewedAt;
            const isEdited = !!review.updatedAt;

            return (
              <div
                key={review.id}
                className="bg-white/5 border border-white/10 p-4 rounded-xl"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <Link
                      to="/profile"
                      search={{ userId: review.userId }}
                      aria-label={`View profile of ${display}`}
                      className="flex items-center gap-3 no-underline"
                    >
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={display}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center font-bold text-white">
                          {display.slice(0, 1).toUpperCase()}
                        </div>
                      )}
                    </Link>

                    <Link
                      to="/profile"
                      search={{ userId: review.userId }}
                      className="no-underline"
                    >
                      <span className="font-bold text-zinc-200 max-w-25 truncate block">
                        {display}
                      </span>
                    </Link>

                    <span className="text-yellow-400 text-sm tracking-widest">
                      {formatStars(review.starRating)}
                    </span>
                  </div>

                  <span className="text-zinc-500 text-xs sm:ml-auto flex gap-1">
                    <span>{formatTimeAgo(timeToDisplay)}</span>
                    {isEdited && (
                      <span className="italic opacity-50">(edited)</span>
                    )}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row w-full items-start justify-between gap-3 sm:gap-4">
                  <p className="flex-1 border-l-4 border-purple-500 pl-4 py-1 text-zinc-300 italic text-base sm:text-lg leading-relaxed whitespace-pre-wrap text-start">
                    "{review.reviewText}"
                  </p>

                  {currentUserId && review.userId === currentUserId ? (
                    <button
                      onClick={() => deleteReviewMutation.mutate(review.igdbId)}
                      className="self-end sm:self-start shrink-0 text-purple-500/40 hover:text-red-400 transition-colors"
                      aria-label="Delete review"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
            <p className="text-zinc-400 text-center">
              No reviews yet. Be the first to review!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
