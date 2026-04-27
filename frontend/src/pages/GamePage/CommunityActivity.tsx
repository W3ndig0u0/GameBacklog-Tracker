import type { Review } from "../../api/reviews/review";
import { useUserProfiles } from "../../hooks/users/useUsers";
import { SectionTitle } from "./SharedUI";

interface CommunityActivityProps {
  reviews?: Review[];
}

const formatStars = (rating: number) => {
  const clamped = Math.max(1, Math.min(5, rating));
  return `${"★".repeat(clamped)}${"☆".repeat(5 - clamped)}`;
};

const formatName = (userId: string) => {
  if (!userId) return "Unknown User";
  const parts = userId.split("|");
  return parts.length > 1 ? parts[1] : userId;
};

const formatTimeAgo = (dateString: string) => {
  if (!dateString) return "just now"; // Säkerhetskoll
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
  const reviewUserIds = Array.from(
    new Set((reviews ?? []).map((review) => review.userId)),
  );
  const { profilesBySub } = useUserProfiles(reviewUserIds);

  return (
    <section className="mt-10">
      <SectionTitle>Community Activity</SectionTitle>
      <div className="space-y-4">
        {reviews && reviews.length > 0 ? (
          reviews.slice(0, 6).map((review) => {
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
                <div className="flex items-center gap-3 mb-2">
                  <a
                    href={`/profile?userId=${encodeURIComponent(review.userId)}`}
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
                  </a>

                  <a
                    href={`/profile?userId=${encodeURIComponent(review.userId)}`}
                    className="no-underline"
                  >
                    <span className="font-bold text-zinc-200">{display}</span>
                  </a>

                  <span className="text-yellow-400 text-sm tracking-widest">
                    {formatStars(review.starRating)}
                  </span>

                  <span className="text-zinc-500 text-xs ml-auto flex gap-1">
                    <span>{formatTimeAgo(timeToDisplay)}</span>
                    {isEdited && (
                      <span className="italic opacity-50">(edited)</span>
                    )}
                  </span>
                </div>
                <p className="border-l-4 border-purple-500 pl-4 py-1 text-zinc-300 italic text-lg leading-relaxed whitespace-pre-wrap text-start">
                  "{review.reviewText}"
                </p>
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
