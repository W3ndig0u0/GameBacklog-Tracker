import { GhostBadge, PrimaryBadge } from "./SharedUI";
import type { GameData } from "./types";

export const GameTags = ({ g }: { g: GameData }) => {
  const primaryGenres = g?.genres || [];
  const primaryThemes = g?.themes || [];
  const platforms = g?.platforms || [];

  return (
    <div className="flex flex-col gap-4 mt-8">
      {primaryGenres.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 cursor-default">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mr-2">
            Genres
          </span>
          {primaryGenres.map((genre) => (
            <PrimaryBadge key={genre.id}>{genre.name}</PrimaryBadge>
          ))}
        </div>
      )}
      {primaryThemes.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 cursor-default">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mr-2">
            Themes
          </span>
          {primaryThemes.map((theme) => (
            <PrimaryBadge key={theme.id}>{theme.name}</PrimaryBadge>
          ))}
        </div>
      )}
      {platforms.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 cursor-default">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mr-2">
            Playable On
          </span>
          {platforms.map((platform) => (
            <GhostBadge key={platform.id}>{platform.name}</GhostBadge>
          ))}
        </div>
      )}
    </div>
  );
};
