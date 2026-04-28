import type { ReactNode } from "react";
import type { Collection } from "../../api/collections/collections";
import { GameCardWrapper } from "../../components/games/GameCardWrapper";
import { useCollectionGameIds } from "../../hooks/collections/useCollections";

export const ProfileSection = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) => (
  <section className="mt-12">
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-start text-white text-2xl md:text-3xl font-black uppercase italic tracking-tighter shrink-0">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm font-medium italic text-zinc-400">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
    {children}
  </section>
);

export const CollectionShelf = ({ collection }: { collection: Collection }) => {
  const { data: gameIds, isLoading } = useCollectionGameIds(collection.id);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white">{collection.name}</h3>
          {collection.description ? (
            <p className="mt-1 text-sm text-zinc-400">
              {collection.description}
            </p>
          ) : null}
        </div>
        <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold text-zinc-200">
          {gameIds?.length ?? 0} games
        </span>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
          Loading games...
        </div>
      ) : gameIds && gameIds.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {gameIds.map((igdbId) => (
            <GameCardWrapper
              key={`${collection.id}-${igdbId}`}
              igdbId={igdbId.toString()}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-800 p-8 text-center text-zinc-500">
          No games in this collection yet.
        </div>
      )}
    </div>
  );
};

export const GameCardShell = ({ children }: { children: ReactNode }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-2 shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:-translate-y-1">
    <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-linear-to-br from-purple-500/25 via-blue-400/20 to-emerald-400/20 blur-2xl transition-opacity duration-300 group-hover:opacity-90" />
    <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-linear-to-br from-yellow-400/15 via-transparent to-purple-400/10 blur-3xl" />
    <div className="relative z-10">{children}</div>
  </div>
);

export const StatCard = ({
  label,
  value,
  subtitle,
  className,
  valueClassName = "text-white",
}: {
  label: string;
  value: string;
  subtitle?: string;
  className: string;
  valueClassName?: string;
}) => (
  <div
    className={`rounded-2xl border bg-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${className}`}
  >
    <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-500">
      {label}
    </div>
    <div
      className={`mt-2 text-3xl font-black tracking-tight ${valueClassName}`}
    >
      {value}
    </div>
    {subtitle ? (
      <div className="mt-1 text-xs text-zinc-400">{subtitle}</div>
    ) : null}
  </div>
);

export const TagChip = ({
  name,
  count,
  accent,
}: {
  name: string;
  count: number;
  accent: string;
}) => (
  <div
    className={`flex items-center justify-between rounded-full border px-3 py-2 text-sm ${accent}`}
  >
    <span className="truncate font-semibold">{name}</span>
    <span className="ml-3 rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">
      {count}
    </span>
  </div>
);
