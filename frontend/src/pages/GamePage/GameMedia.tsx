import { SectionTitle } from "./SharedUI";
import type { GameData } from "./types";
import { getImg } from "./utils";

interface GameMediaProps {
  g: GameData;
  onImageClick: (id: string) => void;
}

export const GameMedia = ({ g, onImageClick }: GameMediaProps) => (
  <section>
    <SectionTitle>Media</SectionTitle>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {g.screenshots?.slice(0, 8).map((s) => (
        <img
          key={s.image_id}
          src={getImg(s.image_id, "720p")}
          className="rounded-xl border border-white/5 hover:border-white/30 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 cursor-zoom-in"
          alt="screenshot"
          onClick={() => onImageClick(s.image_id)}
        />
      ))}
    </div>
    {g.videos?.[0] && (
      <div className="mt-6 aspect-video rounded-2xl overflow-hidden border border-white/5">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${g.videos[0].video_id}`}
          title="Trailer"
          allowFullScreen
        />
      </div>
    )}
  </section>
);
