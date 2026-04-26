import { useState } from "react";
import type { UserGame } from "../../api/library/userGame";
import { SectionTitle } from "./SharedUI";

interface ReviewEditorProps {
  gameId: string;
  myGameData: UserGame;
  updateGame: (data: {
    igdbId: string;
    updates: { reviewNotes: string };
  }) => void;
}

export const ReviewEditor = ({
  gameId,
  myGameData,
  updateGame,
}: ReviewEditorProps) => {
  const [reviewDraft, setReviewDraft] = useState(myGameData?.reviewNotes || "");

  return (
    <section className="mt-10">
      <SectionTitle>Review</SectionTitle>
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <textarea
          className="w-full bg-transparent text-zinc-300 placeholder-zinc-600 resize-none outline-none min-h-25"
          placeholder="What did you think of the game?"
          value={reviewDraft}
          onChange={(e) => setReviewDraft(e.target.value)}
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={() =>
              updateGame({
                igdbId: gameId,
                updates: { reviewNotes: reviewDraft },
              })
            }
            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </section>
  );
};
