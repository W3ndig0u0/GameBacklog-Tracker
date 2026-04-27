import type { Review } from "../../api/reviews/review";
import { SectionTitle } from "./SharedUI";

interface CommunityActivityProps {
  reviews?: Review[];
}

const formatStars = (rating: number) => {
  const clamped = Math.max(1, Math.min(5, rating));
  return `${"★".repeat(clamped)}${"☆".repeat(5 - clamped)}`;
};

const formatName = (userId: string) => {
  if (!userId) return "User";
  return userId.slice(0, 1).toUpperCase() + userId.slice(1, 8);
};

export const CommunityActivity = ({ reviews }: CommunityActivityProps) => (
  <section className="mt-10">
    <SectionTitle>Community Activity</SectionTitle>
    <div className="space-y-4">
      {reviews && reviews.length > 0 ? (
        reviews.slice(0, 6).map((review) => (
          <div
            key={review.id}
            className="bg-white/5 border border-white/10 p-4 rounded-xl"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center font-bold text-white">
                {review.userId?.slice(0, 1).toUpperCase() || "U"}
              </div>
              <span className="font-bold text-zinc-200">
                {formatName(review.userId)}
              </span>
              <span className="text-yellow-400 text-sm tracking-widest">
                {formatStars(review.starRating)}
              </span>
              <span className="text-zinc-500 text-xs ml-auto">
                {new Date(review.reviewedAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-zinc-400">{review.reviewText}</p>
          </div>
        ))
      ) : (
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <p className="text-zinc-400 text-center w-full">
              No reviews yet. Be the first to review!
            </p>
          </div>
        </div>
      )}
    </div>
  </section>
);
