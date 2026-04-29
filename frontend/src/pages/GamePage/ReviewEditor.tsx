import { useState } from "react";
import { toast } from "react-toastify";
import { useCreateOrUpdateReview } from "../../hooks/review/useReviews";
import { SectionTitle } from "./SharedUI";

interface ReviewEditorProps {
  gameId: string;
}

export const ReviewEditor = ({ gameId }: ReviewEditorProps) => {
  const minChars = 5;
  const maxChars = 300;
  const [reviewDraft, setReviewDraft] = useState("");
  const [starRating, setStarRating] = useState(1);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const { mutate: saveReview, isPending } = useCreateOrUpdateReview();

  const trimmedReview = reviewDraft.trim();
  const isTooShort =
    trimmedReview.length > -1 && trimmedReview.length < minChars;
  const isTooLong = reviewDraft.length > maxChars;

  const handleSubmit = () => {
    if (!Number.isFinite(Number(gameId))) {
      toast.error("Could not save review for this game");
      return;
    }

    if (!trimmedReview) {
      setFieldError("Write a review before sending");
      toast.info("Please write a review first");
      return;
    }

    if (isTooShort) {
      setFieldError(`Review must be at least ${minChars} characters`);
      toast.warning(`Review must be at least ${minChars} characters`);
      return;
    }

    if (isTooLong) {
      setFieldError(`Review can be at most ${maxChars} characters`);
      toast.warning(`Review can be at most ${maxChars} characters`);
      return;
    }

    setFieldError(null);
    saveReview({
      igdbId: Number(gameId),
      reviewText: trimmedReview,
      starRating,
    });

    setReviewDraft("");
    setStarRating(1);
  };

  return (
    <section className="mt-10">
      <SectionTitle>Review</SectionTitle>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setStarRating(star)}
              className={`text-2xl transition-colors ${
                star <= starRating
                  ? "text-purple-400"
                  : "text-zinc-900 opacity-30 hover:opacity-100 hover:text-zinc-600"
              }`}
            >
              ★
            </button>
          ))}

          <span className="text-zinc-500 text-sm sm:ml-2">{starRating}/5</span>
        </div>

        <textarea
          className="w-full bg-transparent text-zinc-300 placeholder-zinc-600 resize-none outline-none min-h-25 text-sm sm:text-base"
          placeholder="What did you think of the game?"
          value={reviewDraft}
          onChange={(e) => {
            setReviewDraft(e.target.value);
            if (fieldError) setFieldError(null);
          }}
        />

        <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-0 mt-3">
          <button
            onClick={handleSubmit}
            disabled={isPending || !trimmedReview || isTooShort || isTooLong}
            className="w-full sm:w-auto px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-colors disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-300"
          >
            {isPending ? "Saving..." : "Send"}
          </button>
        </div>

        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div className="text-xs">
            {fieldError ? (
              <span className="text-red-400">{fieldError}</span>
            ) : isTooLong ? (
              <span className="text-red-400">Max {maxChars} characters</span>
            ) : isTooShort ? (
              <span className="text-amber-400">Min {minChars} characters</span>
            ) : (
              <span className="text-zinc-500">Looks good</span>
            )}
          </div>

          <span
            className={`text-xs ${isTooLong ? "text-red-400" : "text-zinc-500"}`}
          >
            {reviewDraft.length}/{maxChars}
          </span>
        </div>
      </div>
    </section>
  );
};
